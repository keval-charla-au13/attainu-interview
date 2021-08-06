const Quizuser = require('../models/quizUser');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

exports.isLoggedIn = async (req, res, next) => {
  // console.log('Do we have playerToken ');
  if (req.cookies.playerCookie) {
    const decoded = await promisify(jwt.verify)(
      req.cookies.playerCookie,
      process.env.PLAYER_SECRET
    );
    req.userFound = await Quizuser.findById(decoded.id);
  }

  next();
};


exports.logout = (req, res, next) => {
  res.cookie('playerCookie', 'logout', {
    expires: new Date(Date.now() + 500),
    httpOnly: true,
  });

  next();
};
