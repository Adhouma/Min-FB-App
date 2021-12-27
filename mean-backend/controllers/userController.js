const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = (request, response, next) => {
  bcrypt.hash(request.body.password, 10).then((hash) => {
    const user = User({
      email: request.body.email,
      password: hash,
    });

    user
      .save()
      .then((result) => {
        response.status(201).json({
          message: "User created",
          result: result,
        });
      })
      .catch((error) => {
        response.status(500).json({
          message: "Invalid authentication credentials",
        });
      });
  });
};

exports.login = (request, response, next) => {
  let fetchedUser;

  User.findOne({ email: request.body.email })
    .then((user) => {
      if (!user) {
        return response.status(401).json({ message: "Auth failed" });
      }

      fetchedUser = user;
      return bcrypt.compare(request.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return response.status(401).json({ message: "Auth failed" });
      }

      // Create JWT token
      // process.env.JWT_SECRET_KEY located in nodemon.json
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      // Return JWT token to front-end
      response.status(200).json({
        message: "Auth granted",
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
      });
    })
    .catch((error) => {
      return response
        .status(401)
        .json({ message: "Invalid authentication credentials" });
    });
};
