const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');
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
  // Check if ObjectID is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({ noprofile: 'There is no profile for this user' });

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


// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body);
  // Check validation
  if (!isValid) return res.status(400).json(errors);

  const profile = await Profile.findOne({ user: req.user.id });

  const newExp = {
    title: req.body.title,
    company: req.body.company,
    location: req.body.location,
    from: req.body.from,
    to: req.body.to,
    current: req.body.current,
    description: req.body.description
  };

  profile.experience.unshift(newExp);
  const savedProfile = await profile.save();

  res.json(savedProfile);
});


// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post('/education', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body);
  // Check validation
  if (!isValid) return res.status(400).json(errors);

  const profile = await Profile.findOne({ user: req.user.id });

  const newEdu = {
    school: req.body.school,
    degree: req.body.degree,
    fieldofstudy: req.body.fieldofstudy,
    from: req.body.from,
    to: req.body.to,
    current: req.body.current,
    description: req.body.description
  };

  profile.education.unshift(newEdu);
  const savedProfile = await profile.save();

  res.json(savedProfile);
});


// @route   DELETE api/profile/experience/:id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  // Check if ObjectID is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({ noexperience: 'There is no experience for this user' });

  const profile = await Profile.findOne({ user: req.user.id });

  // Get remove index
  const removeIndex = profile.experience
    .map(item => item.id)
    .indexOf(req.params.id);

  // Splice out of array
  profile.experience.splice(removeIndex, 1);

  // Save
  const updatedProfile = await profile.save();

  res.json(updatedProfile);
});


// @route   DELETE api/profile/education/:id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  // Check if ObjectID is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({ noeducation: 'There is no education for this user' });

  const profile = await Profile.findOne({ user: req.user.id });

  // Get remove index
  const removeIndex = profile.education
    .map(item => item.id)
    .indexOf(req.params.id);

  // Splice out of array
  profile.education.splice(removeIndex, 1);

  // Save
  const updatedProfile = await profile.save();

  res.json(updatedProfile);
});


// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Profile.findOneAndRemove({ user: req.user.id });
  await User.findOneAndRemove({ _id: req.user.id });

  res.json({ success: true });
});

module.exports = router;
