const express = require('express');
const passport = require('passport');
const router = express.Router();

// file upload helper
const upload = require('../helpers/file-upload.helper').upload;

// controllers
const userController = require('../controllers/user.controller');

// middleware
const { authMiddleware } = require('../middleware/auth'); // Adjust the path according to your file structure

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication operations
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               mobile:
 *                 type: number
 *     responses:
 *       200:
 *         description: User registered successfully
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: user login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User login successfully
 */

// all routes of auth module
router.post('/register', upload.single('profile'), userController.createUser);
router.post('/login', userController.login);
router.post('/updateUser/:id', upload.single('profile'), userController.updateUser);
router.delete('/deleteUser/:id', userController.deleteUser);

/**
 * @swagger
 * /auth/user:
 *   get:
 *     summary: Access user resource
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Hello User
 */
// Route accessible only by authenticated users
router.get('/user', authMiddleware(), (req, res) => {
  const fullName = `${req.user.fname} ${req.user.lname}`;
  res.send(`Hello User ${fullName}`);
});

/**
 * @swagger
 * /auth/admin:
 *   get:
 *     summary: Access admin resource
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Hello Admin
 */
// Route accessible only by admins
router.get('/admin', authMiddleware('admin'), (req, res) => {
  const fullName = `${req.user.username.fname} ${req.user.username.lname}`;
  res.send(`Hello Admin ${fullName}`);
});

/**
 * @swagger
 * /auth/super_admin:
 *   get:
 *     summary: Access super admin resource
 *     tags: [Authentication] 
 *     responses:
 *       200:
 *         description: Hello Super Admin
 */
// Route accessible only by super admins
router.get('/super_admin', authMiddleware('superAdmin'), (req, res) => {
  const fullName = `${req.user.username.fname} ${req.user.username.lname}`;
  res.send(`Hello Super Admin ${fullName}`);
});


// // Route to start Google OAuth authentication
// router.get('/google', passport.authenticate('google', {
//   scope: ['profile', 'email']
// }));

// // Route for Google OAuth callback
// router.get('/google/callback', 
//   passport.authenticate('google', {
//     successRedirect: '/',
//     failureRedirect: '/login'
//   })
// );


module.exports = router;
