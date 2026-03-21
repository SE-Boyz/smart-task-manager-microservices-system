import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth Service API',
      version: '1.0.0',
      description: 'Authentication service for the Smart Task Manager system.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5001}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec
