const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const asyncWrapper = require('./utils/asyncWrapper');
const authRoute = require('./routes/authRoute');
const postRoute = require('./routes/postRoute');
const swapRoute = require('./routes/swapRoute');
const errorMiddleware = require('./middleware/errorHandler');

// HTTP headers for security
app.use(helmet());

// Allow for origins
app.use(cors());

// Body parsers
app.use(express.json()); // parse JSON
app.use(express.urlencoded({ extended: true })); // parse form data

// Routes

// Auth
app.use('/api/auth', authRoute);

// Post
app.use('/api/posts', postRoute);

// Swap
app.use('/api/swaps', swapRoute);

// error middleware
app.use(errorMiddleware);

// Exporitng express app
module.exports = app;