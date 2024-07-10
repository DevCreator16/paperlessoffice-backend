const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// models file import
const User = require('./../models/user');

/** login user api function */
const login = async (req, res) => {
	try {
	  const { email, password } = req.body;
  
	  const user = await User.findOne({ email });
  
	  if (!user || !(await bcrypt.compare(password, user.password))) {
		return res.status(400).json({
		  statusCode: 400,
		  message: "Invalid login credentials",
		});
	  }
  
	  const payload = {
		id: user._id,
		email: user.email,
		role: user.role // Include role in the payload
	  };
  
	  const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY);
  
	  return res.status(200).json({
		statusCode: 200,
		message: "Login successfully",
		access_token: token
	  });
  
	} catch (error) {
	  console.error("Error in login:", error);
	  res.status(500).json({
		statusCode: 500,
		message: "Internal server error",
	  });
	}
  };

/** register user api function */
// const createUser = async (req, res) => {
// 	try {
// 	  const { name, email, password, mobile, role } = req.body; // Added role here
  
// 	  const emailExits = await User.findOne({ email });
// 	  if (emailExits) {
// 		return res.status(400).json({
// 		  statusCode: 400,
// 		  message: "Email id already used",
// 		});
// 	  }
  
// 	  const phoneExits = await User.findOne({ mobile });
// 	  if (phoneExits) {
// 		return res.status(400).json({
// 		  statusCode: 400,
// 		  message: "Mobile number already used",
// 		});
// 	  }
  
// 	  const user = new User();
// 	  user.name = name;
// 	  user.email = email;
// 	  user.password = await hashPassword(password);
// 	  user.mobile = mobile;
// 	  user.profile = req?.file?.filename ? req?.file?.filename : null;
// 	  user.role = role || 'user'; // Assign role, default to 'user'
  
// 	  const userDetail = await user.save();
// 	  userDetail.password = undefined; // Do not return the password
  
// 	  return res.status(200).json({
// 		statusCode: 200,
// 		message: "User created successfully",
// 		data: userDetail
// 	  });
// 	} catch (error) {
// 	  console.log("file: user.controller.js:48 ~ createUser ~ error:", error);
// 	}
//   };

const createUser = async (req, res) => {
	try {  
	  const { fname, lname,email, password, mobile, countryCode, dob, building, apartment, towner, addNo, street, city, nation, role
	  } = req.body;
  
	  // Check for email uniqueness
	  const emailExists = await User.findOne({ email });
	  if (emailExists) {
		return res.status(400).json({
		  statusCode: 400,
		  message: "Email id already used",
		});
	  }
  
	  // Check for mobile uniqueness
	  const phoneExists = await User.findOne({ mobile });
	  if (phoneExists) {
		return res.status(400).json({
		  statusCode: 400,
		  message: "Mobile number already used",
		});
	  }
  
	  // Create the user with nested properties
	  const user = new User({
		fname,
		lname,
		countryCode,
		mobile,
		email,
		password: await hashPassword(password),
		dob,
		profile: req?.file?.filename ? req?.file?.filename : null,
		building,
		apartment,
		towner,
		addNo,
		street,
		city,
		nation,
		role: role || 'user'
	  });
  
	  const userDetail = await user.save();
	  userDetail.password = undefined; // Do not return the password
  
	  return res.status(200).json({
		statusCode: 200,
		message: "User created successfully",
		data: userDetail
	  });
	} catch (error) {
	  console.log("file: user.controller.js ~ createUser ~ error:", error);
	  return res.status(500).json({
		statusCode: 500,
		message: "Server error"
	  });
	}
  };

  const updateUser = async (req, res) => {
	try {
	  const userId = req.params.id;
	  const {
		fname, lname, email, mobile, countryCode, dob, building, apartment, towner, addNo, street, city, nation, role, status
	  } = req.body;
  
	  // Check if the user exists
	  const user = await User.findById(userId);
	  if (!user) {
		return res.status(404).json({
		  statusCode: 404,
		  message: "User not found",
		});
	  }
  
	  // Check for email uniqueness if email is being updated
	//   if (email && email !== user.email) {
	// 	const emailExists = await User.findOne({ email });
	// 	if (emailExists) {
	// 	  return res.status(400).json({
	// 		statusCode: 400,
	// 		message: "Email id already used",
	// 	  });
	// 	}
	//   }
  
	//   // Check for mobile uniqueness if mobile is being updated
	//   if (mobile && mobile !== user.mobile) {
	// 	const phoneExists = await User.findOne({ mobile });
	// 	if (phoneExists) {
	// 	  return res.status(400).json({
	// 		statusCode: 400,
	// 		message: "Mobile number already used",
	// 	  });
	// 	}
	//   }
  
	  // Update user details
	  
	  user.fname = fname || user.fname;
	  user.lname = lname || user.lname;
	  user.email = email || user.email;
	  user.mobile = mobile || user.mobile;
	  user.countryCode = countryCode || user.countryCode;
	  user.dob = dob || user.dob;
	  user.profile = req?.file?.filename ? req?.file?.filename : user.profile;
	  user.building= building || user.building,
	  user.apartment= apartment || user.apartment,
	  user.towner= towner || user.towner,
	  user.addNo= addNo || user.addNo,
	  user.street= street || user.street,
	  user.city= city || user.city,
	  user.nation= nation || user.nation;
	  user.role = role || user.role;
	  user.status = status || user.status;
  
	  const updatedUser = await user.save();
	  updatedUser.password = undefined; // Do not return the password
  
	  return res.status(200).json({
		statusCode: 200,
		message: "User updated successfully",
		data: updatedUser
	  });
	} catch (error) {
	  console.log("file: user.controller.js ~ updateUser ~ error:", error);
	  return res.status(500).json({
		statusCode: 500,
		message: "Server error"
	  });
	}
  };

  const deleteUser = async (req, res) => {
	try {
	  const userId = req.params.id;
  
	  // Check if the user exists
	  const user = await User.findById(userId);
	  if (!user) {
		return res.status(404).json({
		  statusCode: 404,
		  message: "User not found",
		});
	  }
  
	  // Delete the user
	  await User.findByIdAndDelete(userId);
  
	  return res.status(200).json({
		statusCode: 200,
		message: "User deleted successfully"
	  });
	} catch (error) {
	  console.log("file: user.controller.js ~ deleteUser ~ error:", error);
	  return res.status(500).json({
		statusCode: 500,
		message: "Server error"
	  });
	}
  };

  

/** hash password function */
const hashPassword = async (password) => {
	return await bcrypt.hash(password, parseInt(process.env.PASSWORD_SALT));
}

module.exports = { login, createUser, updateUser, deleteUser }