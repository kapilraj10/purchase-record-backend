import express from "express";
import {
  deleteUser,
  updateUserRole,
  getUsersTotalPurchasesLast35Days,
  getUser,
  getAllUsers,
} from "../controllers/adminController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All admin routes require authentication and admin privileges
router.use(protect);
router.use(admin);

router.get("/users", getAllUsers); // list all users (no passwords)
router.get("/user/:id", getUser); // fetch single user (no password)
router.delete("/user/:id", deleteUser);
router.put("/user/:id/role", updateUserRole);
router.get("/users-total-last-35-days", getUsersTotalPurchasesLast35Days); // totals in last 35 days

export default router;