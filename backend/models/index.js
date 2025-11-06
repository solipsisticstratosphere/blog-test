const sequelize = require('../config/db');
const User = require('./User');
const Post = require('./Post');

const models = {
  User,
  Post,
};

module.exports = { sequelize, models };
