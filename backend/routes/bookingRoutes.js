import express from "express";
import { createBooking, getBookings } from "../controllers/bookingController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Booking from "../models/booking.js";

const router = express.Router();

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking (user only)
 */
router.post("/", authMiddleware, createBooking);

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings for a logged-in user
 */
router.get("/", authMiddleware, getBookings);

/**
 * @route   GET /api/bookings/pending
 * @desc    Get all pending bookings (driver only)
 */
router.get("/pending", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "driver") {
            return res.status(403).json({ error: "Only drivers can view pending bookings." });
        }

        const bookings = await Booking.find({ status: "pending" });
        res.json(bookings);
    } catch (err) {
        console.error("Error fetching pending bookings:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;