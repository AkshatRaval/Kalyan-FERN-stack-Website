import { Router } from "express";
import { verifyToken } from "../middleware/verifyIdToken.js";
import { createOrder, verifyOrder } from "../controllers/paymentControls.js";

const paymentRoutes = Router()

paymentRoutes.post("/order", verifyToken, createOrder)
paymentRoutes.post("/verify", verifyToken, verifyOrder)

export default paymentRoutes
