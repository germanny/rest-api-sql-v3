'use strict';
const { Model, DataTypes } = require('sequelize');

// title, description, estimatedTime, materialsNeeded

module.exports = (sequelize) => {
  class Course extends Model { }
  Course.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A course title is required!'
        },
        notEmpty: {
          msg: 'Please provide a course title!'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A course description is required!'
        },
        notEmpty: {
          msg: 'Please provide a course description!'
        }
      }
    },
    estimatedTime: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A course\'s "estimated time" is required!'
        },
        notEmpty: {
          msg: 'Please provide a course\'s "estimated time"!'
        }
      }
    },
    materialsNeeded: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A list of materials needed is required!'
        },
        notEmpty: {
          msg: 'Please provide a list of materials needed!'
        }
      }
    }
  }, { sequelize });

  // Add associations.
  Course.associate = (models) => {
    Course.belongsTo(models.User, { // one to one association
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      }
    });
  };

  return Course;
};
