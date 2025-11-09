import express from "express";
import userroutes from "./user.Routes.js";
import productRoutes from "./purchase.Routes.js";
import adminroutes from "./admin.Routes.js";

const router = express.Router();

router.use("/users", userroutes);
// Also expose the same user routes under /auth so frontend clients
// using /api/auth/login or /api/auth/register keep working.
router.use("/auth", userroutes);
router.use("/products", productRoutes);
router.use("/admin", adminroutes);

export default router;