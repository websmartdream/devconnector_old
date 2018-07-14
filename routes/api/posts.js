const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const validatePostInput = require('../../validation/post');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');


// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get('/', async (req, res) => {
  const posts = await Post.find().sort({ date: -1 });
  res.json(posts);
});


// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  // Check if ObjectID is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({ nopostfound: 'No post found' });

  const post = await Post.findById(req.params.id);
  if (!post) res.status(404).json({ nopostfound: 'No post found' });

  res.json(post);
});


// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);
  // Check validation
  if (!isValid) return res.status(400).json(errors);

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  const savedPost = await newPost.save();
  res.json(savedPost);
});


// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  // Check if ObjectID is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({ nopostfound: 'No post found' });

  const post = await Post.findById(req.params.id);
  if (!post) res.status(404).json({ nopostfound: 'No post found' });

  if (post.user.toString() !== req.user.id) return res.status(401).json({ notauthorized: 'User not authorized' });

  await post.remove();
  res.json({ success: true });
});


// @route   POST api/posts/like/:id
// @desc    Toggle like on a post
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  // Check if ObjectID is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({ nopostfound: 'No post found' });

  const post = await Post.findById(req.params.id);
  if (!post) res.status(404).json({ nopostfound: 'No post found' });

  const filteredLikes = post.likes.filter(like => like.user.toString() !== req.user.id);
  // Unlike if the user already liked
  if (post.likes.length !== filteredLikes.length) {
    post.likes = filteredLikes;
    await post.save();
    return res.json({ unlike: true });
  }

  // Like if the user did not like
  post.likes.unshift({ user: req.user.id });
  // Save
  await post.save();
  res.json({ like: true });
});


// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);
  // Check validation
  if (!isValid) return res.status(400).json(errors);
  // Check if ObjectID is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({ nopostfound: 'No post found' });

  const post = await Post.findById(req.params.id);
  if (!post) res.status(404).json({ nopostfound: 'No post found' });

  const newComment = {
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  };

  // Add to comments array
  post.comments.unshift(newComment);
  // Save
  const savedPost = await post.save();
  res.json(savedPost);
});


// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  // Check if ObjectID is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({ nopostfound: 'No post found' });
  if (!mongoose.Types.ObjectId.isValid(req.params.comment_id)) return res.status(404).json({ nocommentfound: 'No comment found' });

  const post = await Post.findById(req.params.id);
  if (!post) res.status(404).json({ nopostfound: 'No post found' });

  // Check to see if comment exists
  if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
    return res.status(404).json({ commentnotexists: 'Comment does not exist' });
  }

  // Get remove index
  const removeIndex = post.comments
    .map(comment => comment._id.toString())
    .indexOf(req.params.comment_id);

  // Check if the currently logged in user is the owner of the comment
  if (post.comments[removeIndex].user.toString() !== req.user.id) {
    return res.status(401).json({ unauthorized: 'You must be the owner of the comment to delete it' });
  }

  // Splice comment out from the array
  post.comments.splice(removeIndex, 1);

  // Save
  const savedPost = await post.save();
  res.json(savedPost);
});


module.exports = router;
