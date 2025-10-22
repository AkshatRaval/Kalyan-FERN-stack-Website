import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import GCGFormRoute from "./routes/formRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";


dotenv.config();

const port = process.env.PORT
const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use('/api', GCGFormRoute)
app.use('/admin', userRoutes)
app.use('/pay', paymentRoutes)


app.listen(port, () => {
    console.log(`Server is Up At http://localhost:${port}/`)
})