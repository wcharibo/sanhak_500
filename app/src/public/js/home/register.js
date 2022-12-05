"use strict";
<<<<<<< HEAD
//일단 만들어놓고 나중에 수정하자
const wpm = document.querySelector("#wpm"),
  errCnt = document.querySelector("#errCnt"),
  alphabetTimeTable = document.querySelector("#alphabetTimeTable"),
  registerBtn = document.querySelector("button");
=======
// Frontend 화면: HTML과 연결된 javascript 파일
const id = document.querySelector("#id"), // #: tag에 id로 부여되어 있는 id를 가져옴
  name = document.querySelector("#name"),
  psword = document.querySelector("#psword"),
  confirmPsword = document.querySelector("#confirm-psword"),
  registerBtn = document.querySelector("#button");
>>>>>>> 7dcbefe48ecb63333c30afaea5c5c4ff34074ab3

registerBtn.addEventListener("click", register);

function register() {
<<<<<<< HEAD
  const req = {
    wpm: wpm.value,
    errCnt: errCnt.value,
    alphabetTimeTable: alphabetTimeTable.value,
  }; 

  fetch("/register", {
    method: "POST",
    headers: {
=======
  if (!id.value) return alert("아이디를 입력해주십시오.");
  if (psword.value !== confirmPsword.value) 
    return alert("비밀번호가 일치하지 않습니다.");
  
  const req = {
    id: id.value,
    name: name.value,
    psword: psword.value,
  };

  fetch("/register", {
    method: "POST",
    headers:{
>>>>>>> 7dcbefe48ecb63333c30afaea5c5c4ff34074ab3
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then((res) => {
<<<<<<< HEAD
      if (res.success) {
        location.href = "/typing";
      } else {
=======
      if (res.success){
        location.href = "/login";
      } else {
        if (res.err) return alert(res.err);
>>>>>>> 7dcbefe48ecb63333c30afaea5c5c4ff34074ab3
        alert(res.msg);
      }
    })
    .catch((err) => {
<<<<<<< HEAD
      console.error("데이터 저장중 에러 발생"); //이부분 나중에 수정
    });
}

=======
      console.error("회원가입 중 에러 발생");
    });
}
>>>>>>> 7dcbefe48ecb63333c30afaea5c5c4ff34074ab3
