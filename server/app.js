const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const asyncWrapper = require('./utils/asyncWrapper');
const authRoute = require('./routes/authRoute');
const errorMiddleware = require('./middleware/errorHandler');

// HTTP headers for security
app.use(helmet());

// Allow for origins
app.use(cors());

// Body parsers
app.use(express.json()); // parse JSON
app.use(express.urlencoded({ extended: true })); // parse form data

// Routes
app.use('/api/auth', authRoute);

// error middleware
app.use(errorMiddleware);

// Exporitng express app
module.exports = app;