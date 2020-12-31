'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models').User;
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

// A /api/users GET route that will return the currently authenticated user along with a 200 HTTP status code.
router.get('/', asyncHandler(async (req, res) => { // authenticateUser,
  let users = await User.findAll();
  res.json(users);

  // const user = req.currentUser;

  // res.json({
  //   firstName: user.firstName,
  //   lastName: user.lastName
  // });
}));


// A /api/users POST route that will create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
router.post('/', asyncHandler(async (req, res) => {
  console.log(req.body);
  try {
    await User.create(req.body);
    res
      .status(201)
      .location('/')
      .json({ "message": "You successfully created an account!" });
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
