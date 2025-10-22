import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/userControls.js";
import { verifyToken } from "../middleware/verifyIdToken.js";

const userRoutes = Router()

userRoutes.route('/users')
    .get(verifyToken, getAllUsers)

userRoutes.route('/users/:id')
    .get(verifyToken, getUserById)

export default userRoutes
