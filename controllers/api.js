var User = require('../models/User'),
    jwt = require('jsonwebtoken'),
    config = require('../config'),
    crypto = require('crypto'),
    validator = require('validator'),
    sendMail = require('./mailer');

exports.getUsers = function (req, res, next) {
    var error = "";
    User.find({}, "email profile", function (err, user) {
        if (err) return next(err);
        if (!user.length) {
            error = "No Users found.";
            return res.status(404).json(error)
        }
        res.json(user)
    })
};