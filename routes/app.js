const express = require("express");
const router = express.Router();

// import routes utama
const indexRoutes = require("./index");

// mount semua routes
router.use("/", indexRoutes);

module.exports = router;