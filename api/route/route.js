'use strict';
module.exports = function(app) {
  var controller = require('../controller/controller');

  // Routes
  app.route('/users')
    .get(controller.getUserList);

};