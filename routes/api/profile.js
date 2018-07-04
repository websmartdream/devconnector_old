const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const validateProfileInput = require('../../validation/profile');
const Profile = require('../../models/Profile');
const User = require('../../models/User');


// @route   GET api/profile
// @desc    Returns the current users profile data
// @access  Public
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar']);

  if (!profile) return res.status(404).json({ noprofile: 'There is not profile for this user' });

  res.json(profile);
});


// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', async (req, res) => {
  const profile = await Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar']);

  if (!profile) return res.status(404).json({ noprofile: 'There is no profile for this user' });

  res.json(profile);
});


// @route   GET api/profile/handle/:id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:id', async (req, res) => {
  const profile = await Profile.findOne({ user: req.params.id })
    .populate('user', ['name', 'avatar']);

  if (!profile) return res.status(404).json({ noprofile: 'There is no profile for this user' });

  res.json(profile);
});


// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', async (req, res) => {
  const profiles = await Profile.find()
    .populate('user', ['name', 'avatar']);

  if (!profiles) return res.status(404).json({ noprofile: 'There are no profiles' });

  res.json(profiles);
});


// @route   POST api/profile
// @desc    Create user profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);

  // Check validation
  if (!isValid) return res.status(400).json(errors);

  // Get fields
  const profileFields = {};
  profileFields.user = req.user.id;

  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
  // Skills - split into coma separated values
  if (typeof req.body.skills !== 'undefined') profileFields.skills = req.body.skills.split(',');
  profileFields.skills = profileFields.skills.map(item => item.trim());
  // Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  // Looking for the profile with the id of the logged in user
  const profile = await Profile.findOne({ user: req.user.id });

  if (profile) {

    // Update
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      profileFields,
      { new: true }
    );
    res.send(updatedProfile);

  } else {
    // Create new
    // Check if handle exists
    const profileWithHandle = await Profile.findOne({ handle: profileFields.handle });
    if (profileWithHandle) return res.status(400).json({ handle: 'That handle already exists' });

    // Save profile
    const savedProfile = await new Profile(profileFields).save();

    res.json(savedProfile);
  }
});


module.exports = router;
