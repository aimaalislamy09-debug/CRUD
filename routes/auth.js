const express = require("express");
const router = express.Router();
const passport = require("passport");

// start login
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// callback dari google
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.json(req.user); // sementara tampilkan data google
  }
);

module.exports = router;