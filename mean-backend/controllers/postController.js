const Post = require("../models/post");

exports.addPost = (request, response, next) => {
  const serverUrl = request.protocol + "://" + request.get("host");

  const post = new Post({
    title: request.body.title,
    description: request.body.description,
    imagePath: serverUrl + "/images/" + request.file.filename,
    creator: request.userData.userId,
  });
  // Save post to DB
  post
    .save()
    .then((createdPost) => {
      response.status(201).json({
        message: "Post added successfully",
        post: {
          id: createdPost._id,
          title: createdPost.title,
          description: createdPost.description,
          imagePath: createdPost.imagePath,
          creator: createdPost.creator,
        },
      });
    })
    .catch((error) => {
      response.status(500).json({ message: "Creating a post failed" });
    });
};

exports.getPosts = (request, response, next) => {
  const pageSize = +request.query.pageSize;
  const currentPage = +request.query.currentPage;

  const postQuery = Post.find();

  let fetchedPost;

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  postQuery
    .then((posts) => {
      fetchedPost = posts;
      return Post.count();
    })
    .then((count) => {
      response.status(200).json({
        message: "Posts fetched successfully",
        posts: fetchedPost,
        postsCount: count,
      });
    })
    .catch((error) => {
      response.status(500).json({ message: "Fetching posts failed" });
    });
};

exports.getPost = (request, response, next) => {
  Post.findById(request.params.id)
    .then((post) => {
      if (post) {
        response.status(200).json(post);
      } else {
        response.status(404).json({ message: "Post not found" });
      }
    })
    .catch((error) => {
      response.status(500).json({ message: "Fetching post failed" });
    });
};

exports.updatePost = (request, response, next) => {
  let imagePath = request.body.imagePath;

  if (request.file) {
    const serverUrl = request.protocol + "://" + request.get("host");
    imagePath = serverUrl + "/images/" + request.file.filename;
  }

  const updatedPost = {
    _id: request.body.id,
    title: request.body.title,
    description: request.body.description,
    imagePath: imagePath,
  };

  Post.updateOne(
    { _id: request.params.id, creator: request.userData.userId },
    updatedPost
  )
    .then((result) => {
      if (result.modifiedCount === 0) {
        response.status(401).json({ message: "Not authorized!" });
      } else {
        response.status(200).json({ message: "Post updated successfully" });
      }
    })
    .catch((error) => {
      response.status(500).json({ message: "Couldn't update post" });
    });
};

exports.deletePost = (request, response, next) => {
  Post.deleteOne({
    _id: request.params.id,
    creator: request.userData.userId,
  })
    .then((result) => {
      if (result.deletedCount === 0) {
        response.status(401).json({ message: "Deletion not authorized" });
      } else {
        response.status(200).json({ message: "Post deleted" });
      }
    })
    .catch((error) => {
      response.status(500).json({ message: "Deletion post failed" });
    });
};
