import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import resumeRoutes from "./routes/resumeRoutes.js";

dotenv.config();

const app = express();

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ ROUTES
app.use("/api/resume", resumeRoutes);

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("API Running...");
});

// ✅ DB CONNECTION
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err));

// ✅ SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});