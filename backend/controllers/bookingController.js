import Booking from "../models/booking.js";

// Create a new booking
export const createBooking = async (req, res) => {
    try {
        let {
            rideId,
            pickup,
            dropoff,
            pickupCoords,
            dropoffCoords,
            fare,
            tripType,
            seats,
            distance,
            taxiType,
            driverId // ✅ make sure driverId is passed from frontend
        } = req.body;

        // Generate a rideId if not provided
        if (!rideId) {
            rideId = "RIDE" + Math.floor(100000 + Math.random() * 900000);
        }

        const booking = new Booking({
            rideId,
            pickup,
            dropoff,
            pickupCoords,
            dropoffCoords,
            fare,
            tripType,
            seats,
            distance,
            taxiType,
            userId: req.user._id, // set by auth middleware
            driverId: driverId || null, // ✅ store the driver if provided
            status: "pending" // set initial status for driver to accept/reject
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (err) {
        console.error("❌ Error creating booking:", err);
        res.status(400).json({ error: err.message });
    }
};

// Get all bookings for a logged-in user
export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



