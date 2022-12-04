"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/", ctrl.output.home);
router.get("/typing", ctrl.output.typing);
router.get("/register", ctrl.output.register);

router.post("/typing", ctrl.process.typing);
router.post("/register", ctrl.process.register);

module.exports = router;