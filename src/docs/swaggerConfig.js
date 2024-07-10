const swaggerJsdoc = require('swagger-jsdoc');

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express js API',
            version: '1.0.0',
            description: 'API documentation for Express application',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT', // Adjust according to your token format
                },
            },
        },
        security: [{
            bearerAuth: [], // Reference to the security scheme defined above
        }],
    },
    apis: ['./src/routes/*.js'], // path of api routes
};


const swaggerSpec = swaggerJsdoc(swaggerOptions);
module.exports = swaggerSpec;
