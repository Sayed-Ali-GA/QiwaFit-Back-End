const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const bcrypt = require('bcrypt');

const verifyToken = require('../middleware/verify-token');
const User = require('../models/user');

const saltRounds = 12;


//---------------------------- SIGN UP  -----------------------// 
        router.post('/sign-up', async (req, res) => {
            try {
                console.log(req.body)
                const { username, password, age, weight, height, gender } = req.body;
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                 return res.status(409).json({ err: 'Username or Password is invalid, Please try again.' });
                }
                const hashedPassword = bcrypt.hashSync(password, saltRounds);
                const newUser = await User.create({ username, hashedPassword, age, weight, height, gender });
                const payload = {
                        username: newUser.username,
                        _id: newUser._id,
                };
                const token = jwt.sign(payload, process.env.JWT_SECRET);
                    res.status(201).json({ token });
            } catch (err) {
                res.status(400).json({ err: 'Invalid, Please try again.' });
        }
        });

// ------------------------------------------------------------------------------------------


//---------------------------- SIGN IN  -----------------------// 
        router.post('/sign-in', async (req, res, next) => {
            try {
                const user = await User.findOne({ username: req.body.username });
                if (!user) {
                 return res.status(401).json({ err: 'Invalid credentials.' });
                }

            // Check if the password is correct using bcrypt
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.hashedPassword);
            // If the password is incorrect, return a 401 status code with a message
                if (!isPasswordCorrect) {
                 return res.status(401).json({ err: 'Invalid credentials.' });
                }
                const payload = {
                    username: user.username,
                    _id: user._id,
                };
                const token = jwt.sign(payload, process.env.JWT_SECRET);
                res.status(201).json({ token });
            } catch (err) {
                 res.status(500).json({ err: err.message });
                }
        });

// ------------------------------------------------------------------------------------------


// user can view and update their profile information (username, password, age, weight, height

        router.get('/profile', verifyToken, async (req, res) => {
          try {
            const user = await User.findById(req.user._id).select('-hashedPassword');
              res.status(200).json({
                user
        });
          } catch (err) {
            res.status(500).json(err);
            }
        });

// ------------------------------------------------------------------------------------------


// user can view and update their profile information (username, password, age, weight, height.
        router.put('/profile', verifyToken, async (req, res) => {
          try {
              const user = await User.findById(req.user._id);

              if (req.body.username) {
                user.username = req.body.username;
            }
              if (req.body.password) {
                const bcrypt = require('bcrypt');
                  user.hashedPassword = bcrypt.hashSync(req.body.password, 12);
              }
              if (req.body.age) {
                user.age = req.body.age;
              }
              if (req.body.weight) {
                user.weight = req.body.weight;
              }
              if (req.body.height) {
                user.height = req.body.height;
              }
          await user.save();
            res.status(200).json({
              message: "Profile updated successfully"
            });
          } catch (err) {
            res.status(500).json(err);
          }
    });

// ------------------------------------------------------------------------------------------


module.exports = router;

