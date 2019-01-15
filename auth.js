const config = require('./config.js');
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['mongoose'] || req.headers['x-access-token'];
  // decode token
  console.log('token found in header\n');
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.jwt.secret, function (err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        // if everything is good, save to request for use in other routes
        console.log('user token good, user: ' + JSON.stringify(decoded));
        req.decoded = decoded;
        next();
      }
    });

  } else {
    // if there is no token
    // return an error
    console.log('*******no token in request');
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

    // or redirect to login
    //res.redirect('/login');
  }
};
