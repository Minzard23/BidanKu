import express from "express";
import dotenv from "dotenv";
import bookingRoutes from "./src/routes/bookingRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import cors from "cors";
import profileRoutes from "./src/routes/profilRoutes.js";
import kehamilanRoutes from "./src/routes/kehamilanRoutes.js";
import konsultasiRoutes from "./src/routes/konsultasiRoutes.js";
import obatRoutes from "./src/routes/obatRoutes.js";
import pesananRoutes from "./src/routes/pesananRoutes.js";
import artikelRoutes from "./src/routes/artikelRoutes.js";
import agendaRoutes from "./src/routes/agendaRoutes.js";    

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
app.use("/api/kehamilan", kehamilanRoutes);
app.use("/api/konsultasi", konsultasiRoutes);
app.use("/api/obat", obatRoutes);
app.use("/api/pesanan", pesananRoutes);
app.use("/api/artikel", artikelRoutes);
app.use

const PORT = process.env.PORT || 5000;
app.listen (PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
