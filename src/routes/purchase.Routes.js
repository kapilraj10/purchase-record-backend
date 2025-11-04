import express from "express";
import {
  createPurchase,
  getPurchases,
  updatePurchase,
  deletePurchase,
  getTotalPurchasesLast30Days
} from "../controllers/purchaseController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPurchase);             // any user
router.get("/", protect, getPurchases);                // user: own, admin: all
router.get("/total-last-30-days", protect, getTotalPurchasesLast30Days); // total calculation
router.put("/:id", protect, admin, updatePurchase);   // admin only
router.delete("/:id", protect, admin, deletePurchase); // admin only

export default router;
