const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const errorMiddleware = require('./src/middleware/error');

// database config import
require('./src/config/mongo.config');

//swagger package import
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/docs/swaggerConfig');

// import all routes file 
const authRoutes = require('./src/routes/auth.router');
const meRoutes = require('./src/routes/me.router');
const documentRoutes = require('./src/routes/document.router');

// use middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(errorMiddleware);


// Configure session middleware
app.use(session({
	secret: process.env.SESSION_SECRET, // Use an environment variable for the session secret
	resave: false,
	saveUninitialized: true
  }));
  

// all routers
app.use('/auth', authRoutes);
app.use('/me', meRoutes);
app.use('/documents', documentRoutes);

// Route to logout
app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
  });

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(parseInt(process.env.PORT), () => {
	console.log("file: app listening on port ~ ", parseInt(process.env.PORT))
});