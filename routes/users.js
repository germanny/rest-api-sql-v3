'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models').User;
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

// A /api/users GET route that will return the currently authenticated user along with a 200 HTTP status code.
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
  // let users = await User.findAll();
  // res.json(users);
  const user = req.currentUser;

  res
    .status(200)
    .json(user);
}));


// A /api/users POST route that will create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
router.post('/', asyncHandler(async (req, res) => {
  console.log(req.body);
  try {
    await User.create(req.body);
    res
      .status(201)
      .location('/');
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}));

module.exports = router;
