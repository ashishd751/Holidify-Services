'use strict';

var mongoose = require('mongoose'),
  user = mongoose.model('users');

exports.getUserList = function(req, res) {
  user.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};