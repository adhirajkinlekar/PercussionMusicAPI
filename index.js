// import express from 'express';
const express = require('express');
const listRouter = require('./routes/listRouter');
const userRouter = require('./routes/userRouter');
const AppError = require('./utils/appError');
const errorHandler = require('./controller/errorController')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const app = express();

app.use(cors())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());
//middleware to recognize the incoming Request Object as a JSON Object
app.use(express.json());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//serving static files
// app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
  req.currentDate = new Date();
  next();
})

app.use('/api/Lists', listRouter)
app.use('/api/users', userRouter)
app.all('*', (req, res, next) => {
  next(new AppError('cant find route', 404));// passing anything inside next means that it is an error
})
app.use(errorHandler);//having 4 paramters means it is an error handler

module.exports = app;