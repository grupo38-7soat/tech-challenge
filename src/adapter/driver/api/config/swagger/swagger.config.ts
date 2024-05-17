import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation for your API',
    },
  },
  apis: ['src/routes/*.ts'],
}

const swaggerSpecs = swaggerJsdoc(options)

export default swaggerSpecs
