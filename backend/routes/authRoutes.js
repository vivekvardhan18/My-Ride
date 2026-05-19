import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// POST /api/signup
router.post("/signup", async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!["user", "driver"].includes(role)) {
        return res.status(400).json({ error: "Invalid role. Use 'user' or 'driver' only." });
    }

    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "User already exists" });

        const hashed = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashed, role });
        await newUser.save();

        res.status(201).json({ message: "Signup successful" });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// POST /api/login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token, role: user.role, name: user.name });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

export default router;