const express = require("express");
const router = express.Router();

// ✅ Tambahan: passport untuk route Google OAuth
const passport = require("passport");

router.get("/ping", (req, res) => res.send("pong ✅ routes/index.js kebaca"));

const User = require("../models/user");
const hash = require("../helpers/password");
const tokenHelper = require("../helpers/token");

const auth = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole"); // ✅ ini yang kemarin belum ada

// =====================
// REGISTER
// =====================
router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: "username dan password wajib diisi" });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ message: "username sudah digunakan" });
    }

    const hashedPassword = await hash.hashPassword(password);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return next(err);
  }
});

// =====================
// LOGIN (JWT)
// =====================
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: "username dan password wajib diisi" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "username/password salah" });

    const match = await hash.comparePassword(password, user.password);
    if (!match) return res.status(401).json({ message: "username/password salah" });

    const token = tokenHelper.signToken({
      id: user._id.toString(),
      username: user.username,
      role: user.role || "user", // default role "user"
    });

    return res.json({ message: "Login berhasil", token });
  } catch (err) {
    return next(err);
  }
});

// =====================
// PROTECTED ROUTE
// =====================
router.get("/profile", auth, (req, res) => {
  return res.json({
    message: "Ini profile (butuh token)",
    user: req.user,
  });
});

// =====================
// ADMIN ONLY
// =====================
router.get("/admin", auth, authorizeRole("admin"), (req, res) => {
  return res.json({
    message: "Halo Admin ✅",
    user: req.user,
  });
});

// =====================
// GOOGLE OAUTH
// =====================
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => res.json(req.user)
);

module.exports = router;