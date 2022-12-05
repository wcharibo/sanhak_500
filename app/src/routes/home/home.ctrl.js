"use strict";

<<<<<<< HEAD
const Typing = require("../../models/Typing");

const output = {
  home: (req, res) => {
    res.render("home/index");
  },
  typing: (req, res) => {
    res.render("home/tps");
  },
  register: (req, res) => {
    res.render("home/register");
  },
}


const process = {
  typing: async (req, res) => {
    const user = new Typing(req.body);
    const response = await user.typing();
    return res.json(response);
  },

  register: async (req, res) => {
    const user = new Typing(req.body);
    const response = await user.register();
    return res.json(response);
=======
const logger = require("../../config/logger");
const User = require("../../models/User");

const output = {
  home: (req, res) => {
    logger.info(`GET / 304 "홈 화면으로 이동"`);
    res.render("home/index");
  },

  login: (req, res) => {
    logger.info(`GET /login 304 "로그인 화면으로 이동"`);
    res.render("home/login");
  }, 

  register: (req, res) => {
    logger.info(`GET /register 304 "회원가입 화면으로 이동"`);
    res.render("home/register");
  },
};

const process = {
  login: async (req, res) => {
    const user = new User(req.body);
    const response = await user.login();

    const url = {
      method: "POST",
      path: "/login",
      status: response.err ? 400 : 200,
    };

    log(response, url);
    return res.status(url.status).json(response);
  },

  register: async (req, res) => {
    const user = new User(req.body);
    const response = await user.register();

    const url = {
      method: "POST",
      path: "/register",
      status: response.err ? 409 : 201,
    };
    
    log(response, url);
    return res.status(url.status).json(response);
>>>>>>> 7dcbefe48ecb63333c30afaea5c5c4ff34074ab3
  },
};

module.exports = {
  output,
  process,
<<<<<<< HEAD
};
=======
};

const log = (response, url) => {
  if (response.err) {
    logger.error(
      `${url.method} ${url.path} ${url.status} Response: ${response.success}, ${response.err}`
    );
  } else {
    logger.info(
      `${url.method} ${url.path} ${url.status} Response: ${response.success}, ${
        response.msg || ""}`
    );
  }
}
>>>>>>> 7dcbefe48ecb63333c30afaea5c5c4ff34074ab3
