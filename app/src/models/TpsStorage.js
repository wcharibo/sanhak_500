"use strict";

const db = require("../config/db");

class TpsStorage {
  // static getUsers(isAll, ...fields) {}
  // static getUserInfo(wpm) {
  //   return new Promise((resolve, reject) => {
  //     const query = "SELECT * FROM mytps WHERE wpm = ?;";
  //     db.query(query, [wpm], (err, data) => {
  //       if (err) reject(`${err}`);
  //       else resolve(data[0]);
  //     });
  //   });  
  // }

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
  // static async save = {
  //   wpm: wpm.value,
  //   errCnt: errCnt.value,
  //   alphabetTimeTable: 'a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:10,k:11,l:12,m:13,n:14,o:15,p:16,q:17,r:18,s:19,t:20,u:21,v:22,w:23,x:24,y:25,z:26'
  // };
  // const query = connection.query('insert into test set ?', post, function(err, result) {
  //   if (err) {
  //     console.error(err);
  //     return;
  //   }
  //   console.error(result);
  // });

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

