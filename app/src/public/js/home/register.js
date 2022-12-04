"use strict";
//일단 만들어놓고 나중에 수정하자
const wpm = document.querySelector("#wpm"),
  errCnt = document.querySelector("#errCnt"),
  alphabetTimeTable = document.querySelector("#alphabetTimeTable"),
  registerBtn = document.querySelector("button");

registerBtn.addEventListener("click", register);

function register() {
  const req = {
    wpm: wpm.value,
    errCnt: errCnt.value,
    alphabetTimeTable: alphabetTimeTable.value,
  }; 

  fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        location.href = "/typing";
      } else {
        alert(res.msg);
      }
    })
    .catch((err) => {
      console.error("데이터 저장중 에러 발생"); //이부분 나중에 수정
    });
}

