const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Report Service API",
      version: "1.0.0",
      description: "Reporting service for the Smart Task Manager system."
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5004}`
      }
    ]
  },
  apis: ["./src/routes/*.js"]
};

module.exports = swaggerJsdoc(options);
