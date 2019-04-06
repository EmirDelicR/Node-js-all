const express = require("express");
const router = express.Router();
const fileController = require("../../controllers/file");
/**
 * PUT /file/post-image
 */
router.put("/post-image", fileController.upload);

module.exports = router;
