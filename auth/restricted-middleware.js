const jwt = require('jsonwebtoken');
const secret = require('./secrets');

module.exports = (req, res, next) => {
 const token = req.headers.authorization;
 if (token) {
  jwt.verify(token, secret.secretJwt, (err, decodedToken) => {
   if (err) {
    res
     .status(401)
     .json({ message: 'You shall not pass - the token is wrong!' });
   } else {
    next();
   }
  });
 } else {
  res
   .status(401)
   .json({ message: 'You shall not pass. You are not authenticated' });
 }
};
