const { validationResult } = require("express-validator/check");
const Post = require("../models/post");
const User = require("../models/user");
const helpers = require("../util/helpers");

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error(`There is no post with this ID ${postId} !`);
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({ message: "Post fetched.", post: post });
    })
    .catch(err => {
      next(err);
    });
};

exports.getPosts = (req, res, next) => {
  // const currentPage = req.query.page || 1;
  // const perPage = 2;
  let totalItems;
  Post.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return helpers.createPagination(Post, req.query.page);
    })
    .then(posts => {
      res.status(200).json({
        message: "Posts fetched.",
        posts: posts,
        totalItems: totalItems
      });
    })
    .catch(err => {
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect!");
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error("No image provided!");
    error.statusCode = 422;
    throw error;
  }
  let creator;

  const postData = {
    title: req.body.title,
    content: req.body.content,
    creator: req.userId,
    imageUrl: req.file.path
  };
  // Create post in db
  const post = new Post(postData);
  post
    .save()
    .then(result => {
      return User.findById(req.userId);
    })
    .then(user => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then(result => {
      res.status(201).json({
        message: "Post created successfully!",
        post: post,
        creator: { _id: creator._id, name: creator.name }
      });
    })
    .catch(err => {
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect!");
    error.statusCode = 422;
    throw error;
  }

  let updatedData = {
    title: req.body.title,
    content: req.body.content,
    creator: {
      name: "Some dummy user"
    },
    imageUrl: req.body.image
  };

  if (req.file) {
    updatedData.imageUrl = req.file.path;
  }

  if (!updatedData.imageUrl) {
    const error = new Error("No image provided!");
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error(`There is no post with this ID ${postId} !`);
        error.statusCode = 404;
        throw error;
      }
      if (!post.creator.toString() === req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      if (updatedData.imageUrl !== post.imageUrl) {
        helpers.deleteFile(post.imageUrl);
      }
      post = Object.assign(post, updatedData);
      return post.save();
    })
    .then(result => {
      res.status(200).json({ message: "Post updated.", post: result });
    })
    .catch(err => {
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error(`There is no post with this ID ${postId} !`);
        error.statusCode = 404;
        throw error;
      }
      if (!post.creator.toString() === req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      helpers.deleteFile(post.imageUrl);
      return Post.deleteOne({ _id: postId });
    })
    .then(() => {
      return User.findById(req.userId);
    })
    .then(user => {
      user.posts.pull(postId);
      return user.save();
    })
    .then(result => {
      res
        .status(200)
        .json({ message: `Post ${postId} is deleted successfully!` });
    })
    .catch(err => {
      next(err);
    });
};
