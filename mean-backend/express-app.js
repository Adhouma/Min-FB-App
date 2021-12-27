const express = require("express");
const mongoose = require("mongoose");

const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

const expressApp = express();

// Database connection
// process.env.MONGODB_ATLAS_USER && process.env.MONGODB_ATLAS_PASSWORD located in nodemon.json
mongoose
  .connect(
    "mongodb+srv://" +
      process.env.MONGODB_ATLAS_USER +
      ":" +
      process.env.MONGODB_ATLAS_PASSWORD +
      "@cluster0.g2wac.mongodb.net/meanStackDB?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Connection failed");
  });

expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: false }));

// Allow access to images folder from the Frontend
expressApp.use("/images", express.static(__dirname + "/images"));

// Define headers before the routes are defined to avoid CORS policy error
expressApp.use((request, response, next) => {
  // Website you wish to allow to connect
  response.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");

  // Request methods you wish to allow
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );

  // Request headers you wish to allow
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  next();
});

// Use routes
expressApp.use(postRoutes);
expressApp.use(userRoutes);

module.exports = expressApp;
