'use strict';
const { Model, DataTypes } = require('sequelize');
//const bcrypt = require('bcrypt');

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
        len: {
          args: [8, 20],
          msg: 'The password should be between 8-20 characters!'
        }
      }
    },
    // confirmedPassword: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   // set(val) {
    //   //   if (val === this.password) {
    //   //     const hashedPassword = bcrypt.hashSync(val, 10);
    //   //     this.setDataValue('confirmedPassword', hashedPassword);
    //   //   }
    //   // },
    //   validate: {
    //     notNull: {
    //       msg: 'Both passwords must match!'
    //     }
    //   }
    // }
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
