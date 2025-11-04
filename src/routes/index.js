import express from "express";
import userroutes from "./user.Routes.js";
import productRoutes from "./purchase.Routes.js";
import adminroutes from "./admin.Routes.js";

const router = express.Router();

router.use("/users", userroutes);
router.use("/products", productRoutes);
router.use("/admin", adminroutes);

export default router;