const { validationResult } = require("express-validator/check");
const Post = require("../models/post");
const User = require("../models/user");
const helpers = require("../util/helpers");

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error(`There is no post with this ID ${postId} !`);
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: "Post fetched.", post: post });
  } catch (err) {
    next(err);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await helpers.createPagination(Post, req.query.page);

    res.status(200).json({
      message: "Posts fetched.",
      posts: posts,
      totalItems: totalItems
    });
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
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

  const postData = {
    title: req.body.title,
    content: req.body.content,
    creator: req.userId,
    imageUrl: req.file.path
  };
  // Create post in db
  try {
    const post = new Post(postData);
    await post.save();

    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();

    res.status(201).json({
      message: "Post created successfully!",
      post: post,
      creator: { _id: user._id, name: user.name }
    });
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
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

  try {
    let post = await Post.findById(postId);
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

    if (
      updatedData.imageUrl !== "undefined" &&
      updatedData.imageUrl !== post.imageUrl
    ) {
      helpers.deleteFile(post.imageUrl);
    } else {
      updatedData.imageUrl = post.imageUrl;
    }

    post = Object.assign(post, updatedData);
    const result = await post.save();
    res.status(200).json({ message: "Post updated.", post: result });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
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
    await Post.deleteOne({ _id: postId });

    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();

    res
      .status(200)
      .json({ message: `Post ${postId} is deleted successfully!` });
  } catch (err) {
    next(err);
  }
};
