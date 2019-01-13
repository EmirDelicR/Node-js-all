const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

const router = express.Router();

/** always put '/' last because code is execute from top-to-bottom */
router.get("/", (req, res, next) => {
  /** Sending response */
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
