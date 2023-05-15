const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'

const endpointsFiles = ['./routes/index.js', './routes/users.js']

const doc = {
  info: {
    title: 'web API RESTful',
    description: 'Starter pack'
  },
  host: 'localhost:5001',
  schemes: ['http']
}

swaggerAutogen(outputFile, endpointsFiles, doc)
