import express from "express";
import { registerUser } from "../controller/userController.js";
import { loginUser } from "../controller/userController.js";
import { protect } from '../middleware/authMiddleware.js';
import { getUserProfile } from "../controller/userController.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);

// protected routes as token will be required
userRoutes.get("/profile", protect, getUserProfile);

export default userRoutes;