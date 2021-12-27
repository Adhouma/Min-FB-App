const express = require("express");

const PostController = require("../controllers/postController");
const checkAuth = require("../middlewares/check-auth");
const extractFile = require("../middlewares/extract-file");

const router = express.Router();

// Routes
// Add post
router.post("/api/add-post", checkAuth, extractFile, PostController.addPost);

// Get all posts
router.get("/api/posts", PostController.getPosts);

// Get post
router.get("/api/post/:id", PostController.getPost);

// Update post
router.put(
  "/api/update-post/:id", checkAuth, extractFile, PostController.updatePost);

// Delete post
router.delete("/api/delete-post/:id", checkAuth, PostController.deletePost);

module.exports = router;
