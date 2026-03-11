const express = require('express')
const router = express.Router()
const { User } = require('../models')
const { hash, compare } = require('../helpers/password')
const generateToken = require('../helpers/token')

router.post('/login', (req, res, next) => {
    const { email, password } = req.body
    User.findOne({ email})
    .then(user => {
        //cek user exist
        if (user) {
            //cek pass match
            const isMatch = compare(password, user.password)
            if (isMatch) {
                const token = generateToken({ id: user._id, email: user.email})
                res.json({
                    id: user._id,
                    email: user.email,
                    token
                })
            } else {
                res.status(401).json({ message: 'Invalid email or password'})
            }
        } else {
            res.status(401).json({ message: 'Invalid email or password'})
        }
    })
    .catch(err => {
        next(err)
    })
})

router.post('/register', (req, res, next) => {
    const { email, password } = req.body || {}

    User.create({ email, password})
    .then(user => {
        res.json(user)
    })
    .catch(err => {
        next(err)
    })
})

module.exports = router