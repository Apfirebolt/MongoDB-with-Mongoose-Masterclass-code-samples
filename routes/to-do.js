const express = require('express');
const router = express.Router();

// Get All Users
router.get('/', (req, res, next) => {
  res.render('list', { layout:'empty', title: 'All To-do' });
});

module.exports = router;
