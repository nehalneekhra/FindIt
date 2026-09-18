const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const lostRoutes=require("./routes/lostRoutes");
const foundRoutes = require("./routes/foundRoutes");
const claimRoutes = require("./routes/claimRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const userRoutes = require("./routes/userRoutes");
console.log("MONGO_URI =", process.env.MONGO_URI);
console.log("All env keys =", Object.keys(process.env).filter(k => k.includes("MONGO")));

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/lost",lostRoutes);
app.use("/api/found", foundRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 FindIt Backend is Running Successfully!"
  });
});

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});