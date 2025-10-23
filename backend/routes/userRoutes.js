import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/userControls.js";
import { verifyToken } from "../middleware/verifyIdToken.js";

const userRoutes = Router()

userRoutes.get('/users', verifyToken, getAllUsers)

userRoutes.get('/users/:id', verifyToken, getUserById)

export default userRoutes
