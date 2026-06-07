const jwt = require("jsonwebtoken");

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const sendAuthResponse = (res, user) => {
  const token = signToken(user._id);
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
};

module.exports = { signToken, sendAuthResponse };
