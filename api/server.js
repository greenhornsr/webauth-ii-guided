const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

const sessionConfig = {
  name: 'banana',  // by default the name is sid.  changing the name is done to prevent attackers from knowing which library is being used.
  secret: 'keep it secret, keep it safe!',
  resave: false, // if there are no changes to session, don't resave the session
  saveUninitialized: true, // for GDPR compliance, in production...should be false unless client agrees to cookies
  cookie: {
    maxAge: 1000 * 600, //session length in milliseconds...1000 * 600 = 10 minutes
    secure: false, // send cookie only over https, set to true in production
    httpOnly: true, // always set to true, it means client JS can't access the cookie
  },
  store: new KnexSessionStore({
    knex: require('../database/dbConfig'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true, 
    clearInterval: 1000 * 60 * 60  // equivelant to 1 hour.  1000 milliseconds, * 60 = 1 minute, * 60 = 1 hour.
  })
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
