const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../users/users-model.js');
const secret = require('./secrets').secretJwt;
// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
 let user = req.body;
 const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
 user.password = hash;

 Users.add(user)
  .then(saved => {
   res.status(201).json(saved);
  })
  .catch(error => {
   res.status(500).json(error);
  });
});

function generateToken(user) {
 const payload = {
  subject: user.id, // sub in pauload is what the token is about
  username: user.username,
  // ...otherData
 };
 const options = {
  expiresIn: '1d',
 };
 return jwt.sign(payload, secret, options);
}

router.post('/login', (req, res) => {
 let { username, password } = req.body;
 //  console.log(bcrypt);

 Users.findBy({ username })
  .first()
  .then(user => {
   if (user && bcrypt.compareSync(password, user.password)) {
    // 1. generate token
    const token = generateToken(user);
    res.status(200).json({
     // send token back
     message: `Welcome ${user.username}! Here is your token`,
     token,
    });
   } else {
    res.status(401).json({ message: 'Invalid Credentials' });
   }
  })
  .catch(error => {
   res.status(500).json(error);
  });
});

// no logout on the server

module.exports = router;
