"use strict";

const { response } = require("express");
const TpsStorage = require("./TpsStorage");

class Typing {
  constructor(body) {
    this.body = body;
  }

  async typing() {
    const client = this.body;
    try {
      const user = await TpsStorage.getUserInfo(client.wpm);
      return user;
    } catch (err) {
      return { success: false, err };
    }
    // const {wpm} = await TpsStorage.getUserInfo(client.wpm);
    // return {wpm, errCnt, alphabetTimeTable };
  }

  async register() {
    const client = this.body;
    try {
    const response = await TpsStorage.save(client);
    return response;
    } catch (err) {
      return { success: false, err };
    }
  }
}


module.exports = Typing;