const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const compression = require('compression');
const dotenv = require('dotenv');

const shorten = require('./routes/shorten');
const analytics = require('./routes/analytics');
const redirect = require('./routes/redirect');

const app = express();
dotenv.config({ path: './config.env' });

// Implement CORS
app.use(cors()); //Sets Access-Control-Allow-Origin: *
app.options('*', cors());

app.use(helmet());

//We use Morgan Middleware based on whether we are in development environment or production environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Implementing Rate Limiting - Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/', limiter);

// Init Middleware
//Body Parser, reading data from body into req.body
app.use(express.json({ extended: false, limit: '10kb' })); //Middleware
app.use(express.urlencoded({ extended: true, limit: '10kb' })); //URL encoded data parser

//Data Sanitization against XSS Attacks
app.use(xss());

//Compression
app.use(compression());

app.get('/', (req, res) => {
  res.send('Welcome to the URL Shortener API :)');
});

// Define Routes
app.use('/', redirect);
app.use('/api/shorten', shorten);
app.use('/api/analytics', analytics);

//Handling Unhandled Routes
app.all('*', (req, res, next) => {
  res.status(404).json(`Can't find ${req.originalUrl} on this server`);
  next();
});

module.exports = app;
