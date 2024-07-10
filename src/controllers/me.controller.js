const User = require('./../models/user');

const me = async (req, res) => {
	try {
		const email = req.user.email;
		const user = await User.findOne({ email });
		return res.status(200).json({
			statusCode: 200,
			message: "success",
			data: user
		});
	} catch (error) {
		throw new Error(error.message)
	}
}

module.exports = { me }