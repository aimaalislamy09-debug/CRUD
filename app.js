console.log("🔥 APP.JS ROOT BERJALAN");
require("dotenv").config(); // WAJIB paling atas

const express = require("express");
const connectDB = require("./config/connection");
const routes = require("./routes/index");
const errorHandler = require("./middleware/index");

const passport = require("passport");
const session = require("express-session");

const app = express();

// ✅ Debug: buktiin app.js jalan
console.log("✅ app.js start");

// 1) Connect DB
connectDB();

// 2) Body parser (sebelum routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Home route biar ga "Cannot GET /"
app.get("/", (req, res) => {
  res.send("API jalan ✅. Coba /api/ping");
});

// ✅ Debug: buktiin routes/index.js benar-benar di-mount
console.log("✅ mounting routes: /api");

// 3) Session (WAJIB sebelum passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret123",
    resave: false,
    saveUninitialized: false,
  })
);

// 4) Passport config + middleware
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

// 5) Routes
app.get("/", (req, res) => {
  res.send("Server berjalan ✅ coba /api/ping");
});

app.use("/api", routes);

// ✅ 404 handler (kalau route ga ketemu)
app.use((req, res) => {
  return res.status(404).json({
    message: "Route tidak ditemukan",
    path: req.originalUrl,
  });
});

// 6) Error handler (paling bawah)
app.use(errorHandler);

// 7) Listen TERAKHIR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));