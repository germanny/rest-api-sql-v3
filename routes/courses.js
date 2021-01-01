'use strict';

const express = require('express');
const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User;
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

// A /api/courses GET route that will return a list of all courses including the User that owns each course and a 200 HTTP status code.
router.get('/', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    include: [{ model: User }]
  });

  if (courses) {
    //console.log(courses.map(course => course.get({ plain: true })));
    res.json(courses);
  } else {
    res
      .status(404)
      .json({ message: "Sorry, no courses found. :(" });
  }
}));

// A /api/courses/:id GET route that will return the corresponding course along with the User that owns that course and a 200 HTTP status code.
router.get('/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: [{ model: User }]
  });

  if (course) {
    res.json(course);
  } else {
    res
      .status(404)
      .json({ message: "Sorry, course not found. :(" });
  }
}));


// A /api/courses POST route that will CREATE a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
router.post('/', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const course = await Course.create(req.body);
    //console.log(course);
    res
      .status(201)
      .location('/api/courses/' + course.id)
  } catch (error) {
    console.log('ERROR: ', error.name);

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res
        .status(400)
        .json({ errors });
    } else {
      throw error;
    }
  }
}));

// A /api/courses/:id PUT route that will UPDATE the corresponding course and return a 204 HTTP status code and no content.
router.put('/:id', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (course) {
      await course.update({
        title: req.body.title,
        description: req.body.description,
        estimatedTime: req.body.estimatedTime,
        materialsNeeded: req.body.materialsNeeded,
        userId: req.body.userId
      });

      res.status(204);
    } else {
      res
        .status(404)
        .json({ message: "Sorry, course not found. :(" });
    }
  } catch (error) {
    console.log('ERROR: ', error.name);

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res
        .status(400)
        .json({ errors });
    } else {
      throw error;
    }
  }
}));

// A /api/courses/:id DELETE route that will DELETE the corresponding course and return a 204 HTTP status code and no content.
router.delete('/:id', authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);

  if (course) {
    await course.destroy();
    res.status(204);
  } else {
    res
      .status(404)
      .json({ message: "Sorry, course not found. :(" });
  }
}));

module.exports = router;
