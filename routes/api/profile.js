const express = require('express');
const router = express.Router();


// @route   GET api/profile
// @desc    Tests profile route
// @access  public
router.get('/', (req, res) => {
  res.json({ test: true, name: 'profileApi' });
});


module.exports = router;
