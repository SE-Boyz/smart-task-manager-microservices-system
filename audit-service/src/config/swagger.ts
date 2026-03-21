import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Audit Service API',
      version: '1.0.0',
      description: 'Audit service for auth event history in the Smart Task Manager system.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5005}`,
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec
