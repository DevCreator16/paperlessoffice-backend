const express = require('express');
const router = express.Router();

// controller
const meController = require('../controllers/me.controller');

// AUTH middleware
const { isAuthenticatedUser } = require('../middleware/auth');


/**
 * @swagger
 * tags:
 *   name: Me
 *   description: 
 */

/**
 * @swagger
 * /me:
 *   get:
 *     summary: get user data
 *     tags: [Me]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: 
 */
router.get('/', isAuthenticatedUser, meController.me);

module.exports = router;