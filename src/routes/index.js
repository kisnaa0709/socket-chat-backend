const express = require("express");
const auth = require("./authRoutes");
const user = require("./userRoutes");
const router = express();
router.use("/auth", auth);
router.use("/user", user);
module.exports = router;
