const tokenHelper = require("../helpers/token");
const User = require("../models/user");

module.exports = async function auth(req, res, next) {
  try {
    const header = req.headers.authorization; // "Bearer <token>"
    if (!header) return res.status(401).json({ message: "Token tidak ada" });

    const [type, token] = header.split(" ");
    if (type !== "Bearer" || !token) {
      return res.status(401).json({ message: "Format token salah" });
    }

    const decoded = tokenHelper.verifyToken(token);

    // optional: ambil user dari DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User tidak valid" });

    req.user = user; // simpan user login
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid / expired" });
  }
};

const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;