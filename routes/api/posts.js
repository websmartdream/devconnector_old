const express = require('express');
const router = express.Router();


// @route   GET api/posts
// @desc    Tests post route
// @access  public
router.get('/', (req, res) => {
  res.json({ test: true, name: 'postsApi' });
});


module.exports = router;
