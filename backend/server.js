import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import GCGFormRoute from "./routes/formRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// CORS
app.use(cors({
    origin: ["http://localhost:5173", "https://kalyangcg.in", "https://www.kalyangcg.in"],
    credentials: true
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// API routes
app.use('/api', GCGFormRoute);
app.use('/admin', userRoutes);
app.use('/pay', paymentRoutes);

// Serve React Vite build
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../frontend/dist");

if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));

    // Regex fallback for all unknown routes
    app.use((req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });


    console.log("✅ Serving React build from:", frontendPath);
} else {
    console.warn("⚠️ React build not found. Run 'npm run build' in frontend!");
}

// Start server
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${port}`);
});
