"use strict"

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/", ctrl.output.home);
router.get("/login", ctrl.output.login);
router.get("/register", ctrl.output.register);
router.get("/mypage", ctrl.output.mypage);
// router.get("/tps", ctrl.output.tps);

router.post("/login", ctrl.process.login);
router.post("/register", ctrl.process.register);
// router.post("/mypage", ctrl.process.mypage);

module.exports = router;