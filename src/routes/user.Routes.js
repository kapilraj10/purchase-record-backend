import express from "express";
import { createUser, loginUser } from "../controllers/Usercontrollers.js";

const router = express.Router();

// ==================== User Registration ====================
router.post("/register", createUser);

// ==================== User Login ====================
router.post("/login", loginUser);

export default router;
