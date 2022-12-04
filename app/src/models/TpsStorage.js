"use strict";

const db = require("../config/db");

class TpsStorage {
  static getUsers(isAll, ...fields) {}
  static getUserInfo(wpm) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM mytps WHERE wpm = ?;";
      db.query(query, [wpm], (err, data) => {
        if (err) reject(`${err}`);
        else resolve(data[0]);
      });
    });  
  }



  static async save(userInfo) {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO mytps(wpm, errCnt, alphabetTimeTable) VALUES(?, ?, ?);";
      db.query(
        query, 
        [userInfo.wpm, userInfo.errCnt, userInfo.alphabetTimeTable], 
        (err) => {
        if (err) reject(`${err}`);
        else resolve({ success: true });
      });
    });  
  }


  // static async save(tpsInfo) {
  //   return new Promise((resolve, reject) => {
  //     const query = "INSERT INTO mytps(id, wpm, errCnt, alphabetTimeTable) VALUES(?, ?, ?, ?);";
  //     db.query(
  //       query, 
  //       [tpsInfo.id, tpsInfo.wpm, tpsInfo.errCnt, tpsInfo.alphabetTimeTable], 
  //       (err) => {
  //       if (err) reject(`${err}`);
  //       else resolve({ success: true });
  //     });
  //   });  
  // }
}

module.exports = TpsStorage;