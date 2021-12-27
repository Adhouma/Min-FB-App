const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
  try {
    const token = request.headers.authorization.split(" ")[1];
    // process.env.JWT_SECRET_KEY located in nodemon.json
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Get userId from the token
    request.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId
    }
    next();
  } catch (error) {
    response.status(401).json({ message: "You are not authenticated!" });
  }
};
