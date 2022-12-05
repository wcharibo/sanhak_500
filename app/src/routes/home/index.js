<<<<<<< HEAD
"use strict";
=======
"use strict"
>>>>>>> 7dcbefe48ecb63333c30afaea5c5c4ff34074ab3

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/", ctrl.output.home);
<<<<<<< HEAD
router.get("/typing", ctrl.output.typing);
router.get("/register", ctrl.output.register);

router.post("/typing", ctrl.process.typing);
=======
router.get("/login", ctrl.output.login);
router.get("/register", ctrl.output.register);

router.post("/login", ctrl.process.login);
>>>>>>> 7dcbefe48ecb63333c30afaea5c5c4ff34074ab3
router.post("/register", ctrl.process.register);

module.exports = router;