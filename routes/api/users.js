const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const keys = require('../../config/keys');
const User = require('../../models/User');


// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) return res.status(400).json(errors);

  // Looking for the user with the given email
  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json({ email: 'Email address alerady exists' });

  const avatar = gravatar.url(req.body.email, {
    s: '200', // Size
    r: 'pg', // Rating
    d: 'mm' // Default
  });

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    avatar
  });

  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);

  const savedUser = await newUser.save();

  res.json(savedUser);
});


// @route   POST api/users/login
// @desc    Login user / returning JWT token
// @access  Public
router.post('/login', async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) return res.status(400).json(errors);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ email: 'User not found' });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json({ password: 'Password incorrect' });

  // JWT things
  const payload = {
    id: user.id,
    name: user.name,
    avatar: user.avatar
  };

  const token = await jwt.sign(payload, keys.JWTKey, { expiresIn: 3600 });

  res.json({
    message: 'Logged in successfully',
    token: 'Bearer ' + token
  });
});


// @route   POST api/users/current
// @desc    Returning the current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;
