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

const specs = swaggerJsdoc(options)

export default specs
