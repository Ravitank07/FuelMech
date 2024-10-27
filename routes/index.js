const express = require('express');

const routes = express.Router();

routes.use('/admin', require('./admin'));

routes.use('/fuel', require('./fuel'));

routes.use('/mechanic', require('./mechanic'));

routes.use('/user', require('./user'));

module.exports = routes