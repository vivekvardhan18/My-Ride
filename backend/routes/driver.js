import express from "express";
import Booking from "../models/booking.js";
import User from "../models/User.js";
import authenticate from "../middleware/authMiddleware.js";

const router = express.Router();

/* -------------------- Add/Update Vehicle -------------------- */
router.post("/vehicle", authenticate, async (req, res) => {
    const { carModel, carNumber, carType } = req.body;

    if (req.user.role !== "driver") {
        return res.status(403).json({ error: "Only drivers can add vehicle info" });
    }

    const updated = await User.findByIdAndUpdate(
        req.user.id,
        { vehicle: { carModel, carNumber, carType } },
        { new: true }
    );

    res.json({ message: "Vehicle updated", vehicle: updated.vehicle });
});

/* -------------------- Get Vehicle Info -------------------- */
router.get("/vehicle", authenticate, async (req, res) => {
    try {
        if (req.user.role !== "driver") {
            return res.status(403).json({ error: "Only drivers allowed" });
        }

        const driver = await User.findById(req.user.id).select("vehicle");
        res.json(driver.vehicle || {});
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch vehicle info" });
    }
});

/* -------------------- Get All Driver Bookings -------------------- */
router.get("/bookings", authenticate, async (req, res) => {
    try {
        const bookings = await Booking.find({ driverId: req.user.id });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});
// GET /api/driver/respond-status?rideId=RIDE123
// In routes/driver.js
router.get("/respond-status", authenticate, async (req, res) => {
    console.log("📥 Ride ID requested:", req.query.rideId);
    try {
        const { rideId } = req.query;

        if (!rideId) {
            return res.status(400).json({ error: "rideId is required" });
        }

        const booking = await Booking.findOne({ rideId });

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        res.json({ status: booking.status }); // "pending", "accepted", or "rejected"
    } catch (err) {
        console.error("Respond status error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

/* -------------------- Accept a Booking -------------------- */
router.post("/accept/:rideId", authenticate, async (req, res) => {
    try {
        const booking = await Booking.findOneAndUpdate(
            { rideId: req.params.rideId, driverId: req.user.id },
            { status: "accepted" },
            { new: true }
        );
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: "Failed to accept booking" });
    }
});

/* -------------------- Reject a Booking -------------------- */
router.post("/reject/:rideId", authenticate, async (req, res) => {
    try {
        const booking = await Booking.findOneAndUpdate(
            { rideId: req.params.rideId, driverId: req.user.id },
            { status: "rejected" },
            { new: true }
        );
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: "Failed to reject booking" });
    }
});

/* -------------------- Complete a Booking -------------------- */
router.post("/complete/:rideId", authenticate, async (req, res) => {
    try {
        const booking = await Booking.findOneAndUpdate(
            { rideId: req.params.rideId, driverId: req.user.id },
            { status: "completed" },
            { new: true }
        );
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: "Failed to complete booking" });
    }
});

/* -------------------- Get Completed Rides -------------------- */
router.get("/completed", authenticate, async (req, res) => {
    try {
        const rides = await Booking.find({ driverId: req.user.id, status: "completed" });
        res.json(rides);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch completed rides" });
    }
});

/* -------------------- Update Driver Location -------------------- */
router.post("/location", authenticate, async (req, res) => {
    const { lat, lng } = req.body;
    console.log("📍 Driver sending location:", lat, lng);

    if (!lat || !lng) {
        return res.status(400).json({ error: "Coordinates missing" });
    }

    try {
        const updated = await User.findByIdAndUpdate(
            req.user.id,
            {
                location: {
                    type: "Point",
                    coordinates: [lng, lat] // GeoJSON format = [lng, lat]
                }
            },
            { new: true }
        );

        console.log("✅ Updated DB driver location:", updated.location); // ✅ This should show
        res.json({ message: "Location updated", location: updated.location });
    } catch (err) {
        console.error("❌ Mongo update failed:", err);
        res.status(500).json({ error: "Update error" });
    }
});


/* -------------------- Find Nearby Drivers for a User -------------------- */
router.get("/nearby", authenticate, async (req, res) => {
    try {
        if (req.user.role !== "user") {
            return res.status(403).json({ error: "Only users can fetch drivers." });
        }

        const { lat, lng } = req.query;
        if (!lat || !lng) return res.status(400).json({ error: "Coordinates missing" });

        const nearbyDrivers = await User.find({
            role: "driver",
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: 5000 // within 5 km
                }
            }
        }).select("-password");

        res.json(nearbyDrivers);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch nearby drivers" });
    }
});

/* -------------------- Respond to Ride Request -------------------- */
router.post("/respond", authenticate, async (req, res) => {
    try {
        const { rideId, accept } = req.body;

        if (req.user.role !== "driver") {
            return res.status(403).json({ error: "Only drivers can respond to requests." });
        }

        const booking = await Booking.findOne({ rideId });

        if (!booking || booking.status !== "pending") {
            return res.status(404).json({ error: "No pending booking found." });
        }

        if (accept) {
            booking.status = "accepted";
            booking.driverId = req.user.id;
            await booking.save();

            res.json({ message: "Ride accepted", booking });
        } else {
            booking.status = "rejected";
            await booking.save();
            res.json({ message: "Ride rejected" });
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to respond to booking" });
    }
});

export default router;