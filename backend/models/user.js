import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
        type: String,
        enum: ["user", "driver", "admin"],
        default: "user"
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    },
    vehicle: {
        type: {
            carModel: String,
            carNumber: String,
            carType: {
                type: String,
                enum: ["basic", "suv"]
            }
        },
        default: null
    }
});

// 🔥 Geospatial index for nearby driver queries
userSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", userSchema);
export default User;