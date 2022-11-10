"use strict";

const id = document.querySelector("#id"), // #: tag에 id로 부여되어 있는 id를 가져옴
    psword = document.querySelector("#psword"),
    loginBtn = document.querySelector("button");

loginBtn.addEventListener("click", login);

function login() {
    const req = {
        id: id.value,
        psword: psword.value,
    };
    console.log(req);
}