import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

router.post("/assign", async (req, res) => {
    const { rideId, driverId } = req.body;

    try {
        const booking = await Booking.findOneAndUpdate(
            { rideId },
            { driverId, status: "assigned" },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ error: "Ride not found" });
        }

        res.json({ message: "Driver assigned successfully", booking });
    } catch (err) {
        res.status(500).json({ error: "Failed to assign driver" });
    }
});

export default router; // ✅ ES Module style