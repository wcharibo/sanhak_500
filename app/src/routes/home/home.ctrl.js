"use strict";

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
  },
};

module.exports = {
  output,
  process,
};