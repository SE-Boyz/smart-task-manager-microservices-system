function errorHandler(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    message: statusCode === 500 ? "Something went wrong" : message
  });
}

module.exports = errorHandler;
