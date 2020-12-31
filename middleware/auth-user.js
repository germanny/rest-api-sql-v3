'use strict';
const auth = require('basic-auth');
const bcrypt = require('bcryptjs');

const { User } = require('../models/user');

// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req, res, next) => {
  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);
  let message;

  // If the user's credentials are available...
  if (credentials) {
    // Attempt to retrieve the user from the data store
    // by their username (i.e. the user's "key"
    // from the Authorization header).
    const user = await User.findOne({
      where: {
        username: credentials.name
      }
    });

    // If a user was successfully retrieved from the data store...
    if (user) {
      // Use the bcrypt npm package to compare the user's password
      // (from the Authorization header) to the user's password
      // that was retrieved from the data store.
      const authenticated = bcrypt
        .compareSync(credentials.pass, user.confirmedPassword); // returns true or false

      // If the passwords match...
      if (authenticated) {
        // Store the retrieved user object on the Request object
        // so any middleware functions that follow this middleware function
        // will have access to the user's information.
        console.log(`Authentication successful for username: ${user.username}`);
        req.currentUser = user;

        // If user authentication failed...
      } else {
        // Return a response with a 401 Unauthorized HTTP status code.
        message = `Authentication failure for username: ${user.username}`;
      }

      // If user retrieval fails
    } else {
      message = `User not found for username: ${credentials.name}`;
    }

    // If credentials are not available
  } else {
    message = 'Auth header not found';
  }

  // If there were any failures above ...
  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });

    // Or if user authentication succeeded...
  } else {
    // Call the next() method.
    next();
  }
}
