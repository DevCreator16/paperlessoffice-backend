const jwt = require('jsonwebtoken');
const ErrorHandler = require('../helpers/error-handler');
const User = require('../models/user'); 

// Middleware to check if the user is authenticated
// exports.isAuthenticatedUser = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization;
//     if (!token) {
//       return next(new ErrorHandler("Please Login to access this resource", 401));
//     }
//     const verified = jwt.verify(token.substring(7), process.env.JWT_SECRET_KEY);
//     req.user = verified;
//     next();
//   } catch (error) {
//     return next(new ErrorHandler("Access Denied!", 401));
//   }
// };
exports.isAuthenticatedUser = async (req, res, next) => {
  try {
      const token = req.headers.authorization;
      if (!token) {
          return next(new ErrorHandler("Please Login to access this resource", 401));
      }
      const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
      req.user = await User.findById(verified.id);

      if (!req.user) {
          return next(new ErrorHandler("User not found", 404));
      }

      next();
  } catch (error) {
      return next(new ErrorHandler("Access Denied!", 401));
  }
};

// Middleware for role-based access control
exports.authMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
      }

      // Verify the JWT token
      const decodedToken = jwt.verify(token.substring(7), process.env.JWT_SECRET_KEY);
      if (!decodedToken) {
        return next(new ErrorHandler("Invalid token", 401));
      }

      // Fetch the user from database using the decoded token's id
      const user = await User.findById(decodedToken.id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      // Check if the user has the required role
      if (requiredRole && user.role !== requiredRole) {
        return next(new ErrorHandler("Forbidden", 403));
      }

      // Attach the user object to the request for further use
      req.user = user;

      // Continue to the next middleware or route handler
      next();
    } catch (error) {
      return next(new ErrorHandler("Access Denied!", 401));
    }
  };
};