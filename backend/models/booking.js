// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    rideId: {
        type: String,
        required: true
    },
    userId: String,
    driverId: {
        type: String,
        required: false, // optional at start
    },
    pickup: String,
    dropoff: String,
    pickupCoords: {
        type: [Number], // [lat, lng]
        default: undefined
    },
    dropoffCoords: {
        type: [Number], // [lat, lng]
        default: undefined
    },
    fare: Number,
    tripType: String,
    seats: Number,
    distance: Number,
    taxiType: String,
    status: {
        type: String,
        enum: ["pending", "assigned", "accepted", "rejected", "completed"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// If the Booking model is already defined, use that. Otherwise, compile a new model.
const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;