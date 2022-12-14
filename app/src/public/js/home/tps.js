const RANDOM_QUOTE_APU_URL = "http://api.quotable.io/random";
const wordDisplayElement = document.querySelector("#wordDisplay");
const wordInputElement = document.querySelector("#wordInput");
const timerElement = document.querySelector("#timer");
const restartElement = document.querySelector("#restartBtn");
const resultDisplayElement = document.querySelector("#resultDisplay");
const setTimer = document.querySelectorAll("input[name=timer]");
const worstWordDisplayElement = document.querySelector("#worstWordDisplay");
const randomModeElement = document.querySelector("#randomMode");
const recommendModeElement = document.querySelector("#recommendMode");
const toggleButton = document.querySelector('#navbarToggleButton');
const navMenu = document.querySelector('#navbarMenu');
const signInBtn = document.querySelector('#signIn');
const signOutBtn = document.querySelector('#signOut');
const signInLi = document.querySelector('#signInList');
const signOutLi = document.querySelector('#signOutList');
const myPageBtn = document.querySelector('#myPage');
const qnaBtn = document.querySelector('#qna');
let arrayWord = wordDisplayElement.querySelectorAll("span");
let arrayValue = wordInputElement.value.split("");
let practiceTime = document.querySelector('input[name="timer"]:checked').value; //default 연습시간을 30초로 설정
let errCnt = 0;
let wpm = 0;
let targetLetter;
let timeTable = new Array(); //입력시간 저장할 테이블
let timeCalTable = new Array(); //문자 사이 입력시간 저장할 테이블
let alphabetTimeTable = new Array(); //입력시간 기록할 테이블
let alphabetTable = new Array(); //입력된 알파벳 개수 기록할 테이블
let alphabetErrorTable = new Array(); //알파벳 별로 오타 카운트
let alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z"
];
let mode = 0; //0이면 random 1이면 recommend
//sample
let sampleTimeData = new Array(); //입력시간 그래프를 그리기 위한 샘플 데이터
let sampleErrorData = new Array(); //입력시간 그래프를 그리기 위한 샘플 데이터
let sampleCnt = 0;

import { wordData } from "./wordList.js";

randomModeElement.addEventListener('click', () => { //random 버튼 눌렀을 때
  mode = 0;
  getMode();
  worstWordDisplay();
  worstWordDisplayElement.style.display = "none";
})
recommendModeElement.addEventListener('click', () => {  //recommend 버튼 눌렀을 때
  if (localStorage.getItem('accessToken')) {
    mode = 1;
    getMode();
    worstWordDisplay();
    worstWordDisplayElement.style.display = "block";
  } else {
    window.open('/login', 'SignIn', 'width = 500, height = 500'); //로그인상태 아니면 로그인 창 팝업
    mode = 0;
    getMode();
    worstWordDisplay();
    worstWordDisplayElement.style.display = "none";
  }
})

const getRandomWord = () => { //랜덤 연습모드를 위한 단어 랜덤하게 가져오기
  let random = Math.floor(Math.random() * (wordData.length - 1) + 1);
  let arr = wordData[random];
  for (let i = 0; i < 40; i++) {
    random = Math.floor(Math.random() * (wordData.length - 1) + 1);
    arr = arr + " " + wordData[random];
  };
  return arr;
};

const getRecommendWord = () => {  //추천연습모드를 위한 단어 가져오기 (데이터가 없으면 random으로 가져오기)
  let random = Math.floor(Math.random() * (wordData.length - 1) + 1);
  let arr = wordData[random];
  const findFirstWorstWord = (element) => { //취약문자를 첫글자로 가지는 단어들을 고르는 함수
    if (element[0] == targetLetter) return true;
  };
  const findWorstWord = (element) => {  // 취약문자를 포함하는 단어들을 고르는 함수
    for (let i = 0; i < element.length; i++) {
      if (element[i] == targetLetter) {
        return true;
      }
    }
  };

  if (targetLetter) { //취약문자가 존재하면 위에서 고른 단어들의 개수에 따라 추천할 단어들 결정, 첫 글자를 'z'로 가지는 단어들이 적기 때문에
    let sizeOfWord = wordData.filter(findFirstWorstWord).length;
    let worstWord;
    if (sizeOfWord >= 300) {
      worstWord = wordData.filter(findFirstWorstWord);
    }
    else {
      worstWord = wordData.filter(findWorstWord);
    }
    for (let i = 0; i < 40; i++) {
      random = Math.floor(Math.random() * (worstWord.length - 1) + 1);
      arr = arr + " " + worstWord[random];
    }
  }
  else { arr = getRandomWord(); } //취약문자가 없으면 random 모드로 연습시켜서 취약문자 데이터 획득

  return arr;
};

setTimer.forEach((timer) => { //연습시간 설정
  timer.addEventListener("click", () => {
    if (timer.checked) {
      practiceTime = timer.value;
      timerElement.innerText = practiceTime;
    }
  });
  timerElement.innerText = practiceTime;
});

const getRandomPractice = () => { //모드에 따라 가져온 단어 분리하기
  const word = getRandomWord();
  wordDisplayElement.innerText = "";
  word.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    wordDisplayElement.appendChild(characterSpan);
  });
  wordInputElement.value = null;
};

const getRecommendPractice = () => {  //가져온 단어 분리하기
  const word = getRecommendWord();
  wordDisplayElement.innerText = "";
  word.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    wordDisplayElement.appendChild(characterSpan);
  });
  wordInputElement.value = null;
};

const getResult = () => { //문자 입력 끝나면 단어, 입력 div 닫고 결과창 출력
  getTypingSpeed();
  barChartContainerElement.style.display = 'none';
  resultDisplayElement.style.display = "block";
  wordDisplayElement.style.display = "none";
  wordInputElement.style.display = "none";
  let result = `${errCnt} wrong word \n typing speed: ${wpm}wpm`;
  resultDisplayElement.innerHTML = result;
  resultDisplayElement.style.color = "#EFECDD";
};

function getRandomQuote() {
  //sample
  return fetch(RANDOM_QUOTE_APU_URL)
    .then((response) => response.json())
    .then((data) => data.content);
}

async function renderNewQuote() {
  //sample
  const quote = await getRandomQuote();
  wordDisplayElement.innerText = "";
  word.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    wordDisplayElement.appendChild(characterSpan);
  });
  wordInputElement.value = null;
  startTimer(1);
}

wordInputElement.addEventListener("focus", () => {  // inputElement가 focus됐다가 blur되면 타이머 input 초기화
  wordInputElement.addEventListener("blur", () => {
    startTimer(0);
    wordInputElement.value = "";
    arrayWord.forEach((characterSpan) => {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      characterSpan.classList.remove("fixed");
    });
  });
});

wordInputElement.addEventListener("input", () => {  //인풋 이벤트 발생할 때마다 입력된 글자와 비교하여 색 wordDisplay에 색표시
  arrayWord = wordDisplayElement.querySelectorAll("span");
  arrayValue = wordInputElement.value.split("");
  if (arrayValue.length == 1 && timeTable[arrayValue.length] == null) startTimer(1);
  if (arrayValue.length != 0) {
    if (timeTable[arrayValue.length] != null && arrayWord[arrayValue.length - 1].className == "correct"){  //backspace로 이전 문자로 되돌아갔을 때 새로 시간 받아오는 것을 막음
     } 
     else if (arrayWord[arrayValue.length - 1].innerText == arrayValue[arrayValue.length - 1]) {
      timeTable[arrayValue.length - 1] = new Date();
      timeTable[arrayValue.length - 1] =
        timeTable[arrayValue.length - 1].getTime();
    } else {
      timeTable[arrayValue.length - 1] = 0;
    }
  } else {
    errCnt = 0;
    timeTable = new Array();
    timeCalTable = new Array();
    startTimer(0);  //이거로 timer가 중복 실행되는 것을 방지
  }

  arrayWord.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
    } else if (character == " " && characterSpan.innerText == " ") {
      characterSpan.classList.add("space");
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      characterSpan.classList.add("fixed");
      timeTable[arrayValue.length - 1] = 0;
    }
  });

  if (arrayWord.length == arrayValue.length) {  //타이머가 0이거나 단어를 모두 입력하면 연습 종료
    countError();
    getResult();
    wordTime();
    calAlphabetTable();
    alphabetError();
    targetLetter = getMaxError();
    for (let i = 0; i < 26; i++) {
      sampleTimeData[sampleCnt][i] = alphabetTimeTable[i];
      sampleErrorData[sampleCnt][i] = alphabetErrorTable[i];
    }
    sampleCnt++;
    console.log(`${errCnt} error detected`);
  } //renderNewQuote()
});

restartElement.addEventListener("click", () => {
  //재시작하는 버튼 재시작하고 다시 입력창을 focus해줘야 하는 불편함이 있음
  timerElement.style.display = "block";
  barChartContainerElement.style.display = 'none';
  resultDisplayElement.style.display = "none";
  wordDisplayElement.style.display = "block";
  wordInputElement.style.display = "block";
  wordInputElement.focus();
  errCnt = 0;
  timeTable = new Array();
  timeCalTable = new Array();
  getMode();
  worstWordDisplay();
  resetAnimation();
  barChart00.destroy();
  barChart01.destroy();
});

const worstWordDisplay = () => {   //취약문자가 존재하면 recommend mode로 연습할 때 어떤 문자가 취약하며 연습을 하고 있는 지 보여줌
  if (mode == 1) {
    worstWordDisplayElement.style.display = 'block';
    if (targetLetter) worstWordDisplayElement.innerHTML = `취약문자 '${targetLetter}'`;
    else worstWordDisplayElement.innerHTML = `Random Mode`; //취약문자가 없으면 random mode라고 알려줌
  } else {  //recommend mode가 아니면 표시 x
    worstWordDisplayElement.style.display = 'none';
  }
};

const resetAnimation = () => {  //restart버튼 누르면 wordDisplay에 fade in 애니메이션 
  const target = wordDisplayElement;
  target.classList.remove('effect'),
    void target.offsetWidth,
    target.classList.add('effect');
};

const countError = () => {  //잘못 입력한 문자에 fixed 클래스 추가하여 결과를 보여줄 때 fixed 클래스 카운트하는 함수
  for (let i = 0; i < arrayWord.length; i++) {
    if (arrayWord[i].className.includes("fixed")) {
      errCnt += 1;
    }
  }
};

const getMaxError = () => { //각 알파벳의 입력시간 중 가장 큰 값(= 취약문자)을 반환
  let max = Math.max(...alphabetTimeTable);
  return alphabet[alphabetTimeTable.indexOf(max)];
}

const wordTime = () => {  //문자입력시간 분리
  timeCalTable[0] = 0;
  for (let i = 1; i < arrayValue.length; i++) {
    timeCalTable[i] = timeTable[i] - timeTable[i - 1];
  }
};

const calAlphabetTable = () => {  //입력시간이 앞의 문자에 저장됨
  for (let i = 0; i < 26; i++) {
    alphabetTimeTable[i] = 0;
    alphabetTable[i] = 0;
    alphabetErrorTable[i] = 0;
    // sample
    sampleErrorData[sampleCnt] = new Array();
    sampleTimeData[sampleCnt] = new Array();
    // sample
  }
  for (let i = 0; i < arrayValue.length; i++) {
    switch (arrayValue[i]) {
      case "a": //0
        alphabetTimeTable[0] += timeCalTable[i];
        alphabetTable[0] += 1;
        break;
      case "b": //1
        alphabetTimeTable[1] += timeCalTable[i];
        alphabetTable[1] += 1;
        break;
      case "c": //2
        alphabetTimeTable[2] += timeCalTable[i];
        alphabetTable[2] += 1;
        break;
      case "d": //3
        alphabetTimeTable[3] += timeCalTable[i];
        alphabetTable[3] += 1;
        break;
      case "e": //4
        alphabetTimeTable[4] += timeCalTable[i];
        alphabetTable[4] += 1;
        break;
      case "f": //5
        alphabetTimeTable[5] += timeCalTable[i];
        alphabetTable[5] += 1;
        break;
      case "g": //6
        alphabetTimeTable[6] += timeCalTable[i];
        alphabetTable[6] += 1;
        break;
      case "h": //7
        alphabetTimeTable[7] += timeCalTable[i];
        alphabetTable[7] += 1;
        break;
      case "i": //8
        alphabetTimeTable[8] += timeCalTable[i];
        alphabetTable[8] += 1;
        break;
      case "j": //9
        alphabetTimeTable[9] += timeCalTable[i];
        alphabetTable[9] += 1;
        break;
      case "k": //10
        alphabetTimeTable[10] += timeCalTable[i];
        alphabetTable[10] += 1;
        break;
      case "l": //11
        alphabetTimeTable[11] += timeCalTable[i];
        alphabetTable[11] += 1;
        break;
      case "m": //12
        alphabetTimeTable[12] += timeCalTable[i];
        alphabetTable[12] += 1;
        break;
      case "n": //13
        alphabetTimeTable[13] += timeCalTable[i];
        alphabetTable[13] += 1;
        break;
      case "o": //14
        alphabetTimeTable[14] += timeCalTable[i];
        alphabetTable[14] += 1;
        break;
      case "p": //15
        alphabetTimeTable[15] += timeCalTable[i];
        alphabetTable[15] += 1;
        break;
      case "q": //16
        alphabetTimeTable[16] += timeCalTable[i];
        alphabetTable[16] += 1;
        break;
      case "r": //17
        alphabetTimeTable[17] += timeCalTable[i];
        alphabetTable[17] += 1;
        break;
      case "s": //18
        alphabetTimeTable[18] += timeCalTable[i];
        alphabetTable[18] += 1;
        break;
      case "t": //19
        alphabetTimeTable[19] += timeCalTable[i];
        alphabetTable[19] += 1;
        break;
      case "u": //20
        alphabetTimeTable[20] += timeCalTable[i];
        alphabetTable[20] += 1;
        break;
      case "v": //21
        alphabetTimeTable[21] += timeCalTable[i];
        alphabetTable[21] += 1;
        break;
      case "w": //22
        alphabetTimeTable[22] += timeCalTable[i];
        alphabetTable[22] += 1;
        break;
      case "x": //23
        alphabetTimeTable[23] += timeCalTable[i];
        alphabetTable[23] += 1;
        break;
      case "y": //24
        alphabetTimeTable[24] += timeCalTable[i];
        alphabetTable[24] += 1;
        break;
      case "z": //25
        alphabetTimeTable[25] += timeCalTable[i];
        alphabetTable[25] += 1;
        break;
      default: //space
        break;
    }
  }

  for (let i = 0; i < 26; i++) {
    if (alphabetTable[i] == 0) return;
    alphabetTimeTable[i] = alphabetTimeTable[i] / alphabetTable[i];
  }
};

let alphabetError = () => {
  for (let i = 0; i < arrayValue.length; i++) {
    if (
      arrayWord[i].className == "fixed correct" ||
      arrayWord[i].className == "incorrect fixed"
    ) {
      switch (arrayWord[i].innerText) {
        case "a": //0
          alphabetErrorTable[0] += 1;
          break;
        case "b": //1
          alphabetErrorTable[1] += 1;
          break;
        case "c": //2
          alphabetErrorTable[2] += 1;
          break;
        case "d": //3
          alphabetErrorTable[3] += 1;
          break;
        case "e": //4
          alphabetErrorTable[4] += 1;
          break;
        case "f": //5
          alphabetErrorTable[5] += 1;
          break;
        case "g": //6
          alphabetErrorTable[6] += 1;
          break;
        case "h": //7
          alphabetErrorTable[7] += 1;
          break;
        case "i": //8
          alphabetErrorTable[8] += 1;
          break;
        case "j": //9
          alphabetErrorTable[9] += 1;
          break;
        case "k": //10
          alphabetErrorTable[10] += 1;
          break;
        case "l": //11
          alphabetErrorTable[11] += 1;
          break;
        case "m": //12
          alphabetErrorTable[12] += 1;
          break;
        case "n": //13
          alphabetErrorTable[13] += 1;
          break;
        case "o": //14
          alphabetErrorTable[14] += 1;
          break;
        case "p": //15
          alphabetErrorTable[15] += 1;
          break;
        case "q": //16
          alphabetErrorTable[16] += 1;
          break;
        case "r": //17
          alphabetErrorTable[17] += 1;
          break;
        case "s": //18
          alphabetErrorTable[18] += 1;
          break;
        case "t": //19
          alphabetErrorTable[19] += 1;
          break;
        case "u": //20
          alphabetErrorTable[20] += 1;
          break;
        case "v": //21
          alphabetErrorTable[21] += 1;
          break;
        case "w": //22
          alphabetErrorTable[22] += 1;
          break;
        case "x": //23
          alphabetErrorTable[23] += 1;
          break;
        case "y": //24
          alphabetErrorTable[24] += 1;
          break;
        case "z": //25
          alphabetErrorTable[25] += 1;
          break;
        default: //space
          break;
      }
    }
  }
};

let startTime, timerInterval;
const startTimer = (timerOn) => {
  //타이머
  timerElement.innerText = practiceTime;
  if (timerOn == 1) {
    console.log('start');
    startTime = new Date();
    timerInterval = setInterval(() => {
      timerElement.innerText = practiceTime - getTimerTime();
      if (timerElement.innerText == 0) { //타이머가 0이 되면 결과 출력
        getResult();
        countError();
        wordTime();
        calAlphabetTable();
        alphabetError();
        targetLetter = getMaxError();
        for (let i = 0; i < 26; i++) {
          sampleTimeData[sampleCnt][i] = alphabetTimeTable[i];
          sampleErrorData[sampleCnt][i] = alphabetErrorTable[i];
        }
        sampleCnt++;
      }
    }, 1000);
  } else {
    clearInterval(timerInterval);
    console.log('clear');
  }
};

const getTimerTime = () => {  //연습을 시작한 시간에서 현재 시간을 빼주는 함수
  return Math.floor((new Date() - startTime) / 1000);
};

const getTypingSpeed = () => {  //타이핑 속도 가져오는 함수
  wpm =
    ((arrayValue.length / 5) *
      (arrayValue.length / (arrayValue.length + errCnt)) *
      60) /
    practiceTime;
  wpm = Math.floor(wpm);
};

const getMode = () => { //mode에 따라 연습모드 가져옴
  if (mode == 1) {
    getRecommendPractice();
  } else {
    getRandomPractice();
  }
};

getMode();

toggleButton.addEventListener('click', () => {
  if (localStorage.getItem('accessToken')) {
    signInLi.style.display = 'none';
    signOutLi.style.display = 'block';
  } else {
    signInLi.style.display = 'block';
    signOutLi.style.display = 'none';
  }
  navMenu.classList.toggle('active');
});

signOutBtn.addEventListener('click', () => {  //로그아웃 버튼
  localStorage.removeItem('accessToken');
})

signInBtn.addEventListener('click', () => {
  window.open('/login', 'SignIn', 'width = 500, height = 500'); //로그인 창 팝업
})

myPageBtn.addEventListener('click', ()=>{
  if(localStorage.getItem('accessToken')){
    location.href = '/mypage';
  } else{
    window.open('/login', 'SignIn', 'width = 500, height = 500'); //로그인 창 팝업
  }
})

qnaBtn.addEventListener('click', ()=>{
  alert('깃허브에서 contributer에게 연락주세요');
})

/*chart*/
let barChartElement00 = document.getElementById('bar-chart00');
let barChartElement01 = document.getElementById('bar-chart01');
let barChartContainerElement = document.querySelector('#chartContainer');
let graphElement = document.querySelector("#graphButton");
let barChart00;
let barChart01;

graphElement.addEventListener("click", () => {
  barChartContainerElement.style.display = 'block';
  resultDisplayElement.style.display = "none";
  wordDisplayElement.style.display = "none";
  wordInputElement.style.display = "none";
  timerElement.style.display = "none";
  
  barChart00 = new Chart(barChartElement00,{
    type : 'bar',
    data :{
      labels : ["a","b","c","d","e","f","g","h","i","j","k","l","m",
      "n","o","p","q","r","s","t","u","v","w","x","y","z"],
      datasets : [
        {
        label: "Alphabet Input Time(ms)",
        data: alphabetTimeTable,
        backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
        }
      ]   
    },
    options: {
      responsive: true,
      scales: {
        y: {
          ticks: { color: 'white', beginAtZero: true }
        },
        x: {
          ticks: { color: 'white', beginAtZero: true }
        }
      }
    }
  })

  barChart01 = new Chart(barChartElement01,{
    type : 'bar',
    data :{
      labels : ["a","b","c","d","e","f","g","h","i","j","k","l","m",
      "n","o","p","q","r","s","t","u","v","w","x","y","z"],
      datasets : [
        {
          label: "Alphabet Error Count",
          data: alphabetErrorTable,
          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          ticks: { color: 'white', beginAtZero: true }
        },
        x: {
          ticks: { color: 'white', beginAtZero: true }
        }
      }
    }
  })

  errCnt = 0;
  timeTable.splice(0);
  timeCalTable.splice(0);
});