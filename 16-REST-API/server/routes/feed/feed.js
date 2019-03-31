const express = require("express");
const router = express.Router();

const feedController = require("../../controllers/feed");
const validation = require("./validation");
const middleware = require("../../middleware/middleware");

/**
 * GET /feed/post/:postId
 */
router.get("/post/:postId", middleware.isAuth, feedController.getPost);

/**
 * GET /feed/posts
 */
router.get("/posts", middleware.isAuth, feedController.getPosts);

/**
 * POST /feed/post
 */
router.post(
  "/post",
  middleware.isAuth,
  validation.postFeed,
  feedController.createPost
);

/**
 * PUT /feed/post/:postId
 */
router.put(
  "/post/:postId",
  middleware.isAuth,
  validation.postFeed,
  feedController.updatePost
);

/**
 * DELETE /feed/post/:postId
 */
router.delete("/post/:postId", middleware.isAuth, feedController.deletePost);

module.exports = router;
