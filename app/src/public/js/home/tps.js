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
let arrayWord = wordDisplayElement.querySelectorAll("span");
let arrayValue = wordInputElement.value.split("");
let practiceTime = document.querySelector('input[name="timer"]:checked').value;
let errCnt = 0;
let wpm = 0;
let targetLetter = 'e';
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
  "z",
];
let mode = 0; //0이면 random 1이면 recommend
//sample
let sampleTimeData = new Array(); //입력시간 그래프를 그리기 위한 샘플 데이터
let sampleErrorData = new Array(); //입력시간 그래프를 그리기 위한 샘플 데이터
let sampleCnt = 0;
const popupSignIn = () => {
  let pop = window.open('/login', 'SignIn', 'width = 500, height = 500');
}

randomModeElement.addEventListener('click', () => {
  mode = 0;
  getMode();
  worstWordDisplayElement.style.display = "none";
})
recommendModeElement.addEventListener('click', () => {
  mode = 1;
  getMode();
  worstWordDisplayElement.style.display = "block";
})


import { wordData } from "./wordList.js";

const getRandomWord = () => {
  //랜덤 연습모드를 위한 단어 랜덤하게 가져오기
  let random = Math.floor(Math.random() * (wordData.length - 1) + 1);
  let arr = wordData[random];
  for (let i = 0; i < 30; i++) {
    random = Math.floor(Math.random() * (wordData.length - 1) + 1);
    arr = arr + " " + wordData[random];
  };
  return arr;
};

const getRecommendWord = () => {  //추천연습모드를 위한 단어 가져오기 (데이터가 없으면 random으로 가져오기)
  let random = Math.floor(Math.random() * (wordData.length - 1) + 1);
  let arr = wordData[random];
  const findFirstWorstWord = (element) => {
    if (element[0] == targetLetter) return true;
  };
  const findWorstWord = (element) => {
    for (let i = 0; i < element.length; i++) {
      if (element[i] == targetLetter) {
        return true;
      }
    }
  };

  if (targetLetter) {
    let sizeOfWord = wordData.filter(findFirstWorstWord).length;
    let worstWord;
    if (sizeOfWord >= 300) {
      worstWord = wordData.filter(findFirstWorstWord);
    }
    else {
      worstWord = wordData.filter(findWorstWord);
    }
    // console.log(worstWord);
    for (let i = 0; i < 30; i++) {
      random = Math.floor(Math.random() * (worstWord.length - 1) + 1);
      arr = arr + " " + worstWord[random];
    }
  }
  else { arr = getRandomWord(); }

  return arr;
};

setTimer.forEach((timer) => {
  //연습시간 설정
  timer.addEventListener("click", () => {
    if (timer.checked) {
      practiceTime = timer.value;
      timerElement.innerText = practiceTime;
    }
  });
});

const getRandomPractice = () => {
  //모드에 따라 가져오 단어 분리하기
  const word = getRandomWord();
  wordDisplayElement.innerText = "";
  word.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    wordDisplayElement.appendChild(characterSpan);
  });
  wordInputElement.value = null;
};

const getRecommendPractice = () => {
  const word = getRecommendWord();
  wordDisplayElement.innerText = "";
  word.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    wordDisplayElement.appendChild(characterSpan);
  });
  wordInputElement.value = null;
};

worstWordDisplayElement.innerHTML = `취약문자 '${targetLetter}'`;

const getResult = () => {
  //문자 입력 끝나면 단어, 입력 div 닫고 결과창 출력
  startTimer(0);
  getTypingSpeed();
  resultDisplayElement.style.display = "block";
  wordDisplayElement.style.display = "none";
  wordInputElement.style.display = "none";
  let result = `${errCnt} wrong word \n typing speed: ${wpm}wpm`;
  resultDisplayElement.innerHTML = result;
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

wordInputElement.addEventListener("focus", () => {
  // input focus->start timer, input unfocused->stop timer and reset
  // startTimer(1);
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

wordInputElement.addEventListener("input", () => {
  //인풋 이벤트 발생할 때마다 입력된 글자와 비교하여 색 wordDisplay에 색표시
  arrayWord = wordDisplayElement.querySelectorAll("span");
  arrayValue = wordInputElement.value.split("");
  if (arrayValue.length == 1 && timeTable[arrayValue.length] == null) startTimer(1);
  if (arrayValue.length != 0) {
    if (
      timeTable[arrayValue.length] != null &&
      arrayWord[arrayValue.length - 1].className == "correct"
    ) {
      //backspace로 이전 문자로 되돌아갔을 때 새로 시간 받아오는 것을 막음
    } else if (
      arrayWord[arrayValue.length - 1].innerText ==
      arrayValue[arrayValue.length - 1]
    ) {
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
    getRandomPractice();
  }

  let correct = true;
  arrayWord.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (character == " " && characterSpan.innerText == " ") {
      characterSpan.classList.add("space");
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      characterSpan.classList.add("fixed");
      correct = false;
      timeTable[arrayValue.length - 1] = 0;
    }
  });

  if (arrayWord.length == arrayValue.length) {
    //타이머가 0이거나 단어를 모두 입력하면 연습 종료
    countError();
    getResult();
    wordTime();
    console.log(`${errCnt} error detected`);
  } //renderNewQuote()
});

restartElement.addEventListener("click", () => {
  //재시작하는 버튼 재시작하고 다시 입력창을 focus해줘야 하는 불편함이 있음
  resultDisplayElement.style.display = "none";
  wordDisplayElement.style.display = "block";
  wordInputElement.style.display = "block";
  wordInputElement.focus();
  errCnt = 0;
  timeTable = new Array();
  timeCalTable = new Array();
  getMode();
  resetAnimation();
});

const resetAnimation = ()=>{
  const target = wordDisplayElement;

  target.classList.remove('effect'),
  void target.offsetWidth,
  target.classList.add('effect');
}

const countError = () => {
  //잘못 입력한 문자에 fixed 클래스 추가하여 결과를 보여줄 때 fixed 클래스 카운트하는 함수
  for (let i = 0; i < arrayWord.length; i++) {
    if (arrayWord[i].className.includes("fixed")) {
      errCnt += 1;
    }
  }
};

const wordTime = () => {
  //문자입력시간 분리
  timeCalTable[0] = 0;
  for (let i = 1; i < arrayValue.length; i++) {
    timeCalTable[i] = timeTable[i] - timeTable[i - 1];
  }
};

const calAlphabetTable = () => {
  //입력시간이 앞의 문자에 저장됨
  for (let i = 0; i < 26; i++) {
    alphabetTimeTable[i] = 0;
    alphabetTable[i] = 0;
    alphabetErrorTable[i] = 0;
    // sample
    sampleErrorData[sampleCnt] = new Array();
    sampleTimeData[sampleCnt] = new Array();
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
const startTimer = (i) => {
  //타이머
  timerElement.innerText = practiceTime;
  if (i == 1) {
    startTime = new Date();
    timerInterval = setInterval(() => {
      timerElement.innerText = practiceTime - getTimerTime();
      if (timerElement.innerText == 0) {
        startTimer(0);
        countError();
        getResult();
        wordTime();
        calAlphabetTable();
        alphabetError();
        let max = Math.max(...alphabetTimeTable);
        targetLetter = alphabet[alphabetTimeTable.indexOf(max)];
        console.log(alphabetTimeTable.indexOf(max));
        console.log(alphabetTimeTable);
        console.log(alphabet[alphabetTimeTable.indexOf(max)]);
        for (let i = 0; i < 26; i++) {
          sampleTimeData[sampleCnt][i] = alphabetTimeTable[i];
          sampleErrorData[sampleCnt][i] = alphabetErrorTable[i];
        }
        console.log(sampleTimeData);
        console.log(sampleErrorData);
        sampleCnt++;
      } //if timer is 0 then stop practice and getResult
    }, 1000);
  } else {
    clearInterval(timerInterval);
    return;
  }
};

const getTimerTime = () => {
  //연습을 시작한 시간에서 현재 시간을 빼주는 함수
  return Math.floor((new Date() - startTime) / 1000);
};

const getTypingSpeed = () => {
  //타이핑 속도 가져오는 함수
  wpm =
    ((arrayValue.length / 5) *
      (arrayValue.length / (arrayValue.length + errCnt)) *
      60) /
    practiceTime;
  wpm = Math.floor(wpm);
};

const getMode = () =>{
  if (mode == 1) {
    getRecommendPractice();
  } else {
    getRandomPractice();
  }
};

getMode();