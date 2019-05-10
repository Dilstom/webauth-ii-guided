const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session'); // 1.add this

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

// 3.add this
const sessionConfig = {
 name: 'monkey',
 secret: 'keep it secret, keep it safe',
 cookie: {
  maxAge: 1000 * 60 * 10, // in ms available (15 min)
  //   maxAge: 1000 * 60 * 60 * 24, // in ms available (24 hours)
  secure: false, // used over http only 'false' for development
  httpOnly: true, // cannot access the cookie
 },
 // can the user access the cookie from js using document.cookie
 resave: false, //
 saveUninitialized: false, // GDPR laws against setting cookies automatically
};

server.use(session(sessionConfig)); // 2. add this

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
 res.send("It's alive!");
});

module.exports = server;
