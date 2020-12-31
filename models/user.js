'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

// firstName, lastName, emailAddress, password

module.exports = (sequelize) => {
  class User extends Model { }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A first name is required!'
        },
        notEmpty: {
          msg: 'Please provide your first name!'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A last name is required!'
        },
        notEmpty: {
          msg: 'Please also provide your last name!'
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { // constraint
        msg: 'The email you entered already exists.'
      },
      validate: {
        notNull: {
          msg: 'An email address is required.'
        },
        isEmail: {
          msg: 'Please provide a valid email.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required!'
        },
        notEmpty: {
          msg: 'Please provide a password!'
        },
      },
      set(value) { // len validation does not seem to work with a setter
        if (value.length >= 8 && value.length <= 20) {
          this.setDataValue('password', bcrypt.hashSync(value, 10));
        } else {
          throw new Error('Your password should be between 8-20 characters!');
        }
      }
    }
  }, { sequelize });

  // Add associations.
  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      }
    }); // This tells Sequelize that a person can be associated with one or more (or "many") courses.
  };

  return User;
};
