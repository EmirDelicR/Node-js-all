const express = require("express");
const router = express.Router();

const authController = require("../../controllers/auth");
const validation = require("./validation");
const middleware = require("../../middleware/middleware");

/**
 * PUT /auth/signup
 */
router.put("/signup", validation.postUser, authController.signup);

/**
 * POST /auth/login
 */
router.post("/login", authController.login);

/**
 * GET /auth/status
 */
router.get("/status", middleware.isAuth, authController.getUserStatus);

/**
 * PATCH /auth/status
 */
router.patch(
  "/status",
  middleware.isAuth,
  validation.updateStatus,
  authController.setUserStatus
);

module.exports = router;
