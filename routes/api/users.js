const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.json({ test: true, name: 'userApi' });
});


module.exports = router;
