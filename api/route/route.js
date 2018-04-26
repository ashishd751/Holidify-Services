'use strict';
module.exports = function(app) {
  var controller = require('../controller/controller');

  // Routes
  app.route('/registerUser')
    .post(controller.register);    

  app.route('/login')
    .post(controller.login);  

  app.route('/users')
    .get(controller.getUserList);
};