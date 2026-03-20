function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === 11000) {
    return res.status(409).json({
      message: "Resource already exists"
    });
  }

  if (err.name === "MongoServerSelectionError") {
    return res.status(503).json({
      message: "Database is unavailable"
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json({
    message: statusCode === 500 ? "Something went wrong" : message
  });
}

module.exports = errorHandler;
