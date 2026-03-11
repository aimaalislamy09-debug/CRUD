const express = require('express');
const router = express.Router();

const User = require('../models/user');
const hash = require('../helpers/password');

// REGISTER
router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'username dan password wajib diisi' });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ message: 'username sudah digunakan' });
    }

    const hashedPassword = await hash.hashPassword(password);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

//run start --- IGNORE ---