const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

/* =======================
   CORS
======================= */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.options("*", cors());

/* =======================
   Middleware
======================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   MongoDB Connection
======================= */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

/* =======================
   Routes
======================= */

const adminRoutes = require("./routes/adminRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const chapterAmbassadorRoutes = require(
  "./routes/chapterAmbassadorRoutes"
);
const WLCteamRoutes = require("./routes/WLCteamRoutes");
const WLCchapterAmbassadorRoutes = require(
  "./routes/WLCchapterAmbassadorRoutes"
);
const teamRoutes = require("./routes/teamRoutes");
const videoRoutes = require("./routes/videoRoutes");
const summitRoutes = require("./routes/summitRoutes");
const gfetscRoutes = require("./routes/gfetscRoute");
const blogRoutes = require("./routes/blogRoutes");
const contactRoutes = require(
  "./routes/contactRoutes"
);
const WLCblogRoutes = require("./routes/WLCblogRoutes");


app.use("/api/admin", adminRoutes);
app.use("/api/application", applicationRoutes);
app.use(
  "/api/chapter-ambassador",
  chapterAmbassadorRoutes
);
app.use("/api/team", teamRoutes);
app.use(
  "/api/wlc-chapter-ambassador",
  WLCchapterAmbassadorRoutes
);
app.use("/api/wlc-team", WLCteamRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/summits", summitRoutes);
app.use("/api/gfetsc", gfetscRoutes);
app.use("/api/blog", blogRoutes);

app.use(
  "/api/contact",
  contactRoutes
);
app.use("/api/wlc-blog", WLCblogRoutes);

/* =======================
   Home Route
======================= */
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

/* =======================
   404 Route
======================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;