import express from "express";
import dotenv from "dotenv";
import bookingRoutes from "./src/routes/bookingRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import cors from "cors";
import profileRoutes from "./src/routes/profilRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Selamat datang di BidanKu API");
});

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server BidanKu jalan normal." });
});

app.use("/api/auth", authRoutes);

app.use("/api/booking", bookingRoutes);

app.use("/api/profil", profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen (PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
