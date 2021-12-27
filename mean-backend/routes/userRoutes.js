const express = require("express");

const UserController = require("../controllers/userController");

const router = express.Router();

// Routes
// Signup User
router.post("/api/user/signup", UserController.signup);

// Login User
router.post("/api/user/login", UserController.login);

module.exports = router;
