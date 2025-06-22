
const errorHandler = (err, req, res, next) => {
  console.error("Error occurred: ", err.stack); // Log the stack trace for debugging

  const statusCode = err.statusCode || 500; // Default to 500 if no status code is set
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    // Optionally, include stack trace in development
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, 
  });
};

module.exports = errorHandler;
