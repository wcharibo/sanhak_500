const RANDOM_QUOTE_APU_URL = 'http://api.quotable.io/random';
const wordDisplayElement = document.querySelector('#wordDisplay');
const wordInputElement = document.querySelector('#wordInput');
const timerElement = document.querySelector('#timer');
const restartElement = document.querySelector('#restartBtn');
const resultDisplayElement = document.querySelector('#resultDisplay');
const setTimer = document.querySelectorAll('input[name=timer]');
let arrayWord = wordDisplayElement.querySelectorAll('span');
let arrayValue = wordInputElement.value.split('');
let practiceTime= document.querySelector('input[name="timer"]:checked').value;
let errCnt = 0;
let backspaceCnt = 0;
let timeTable = new Array();
let timeExTable = new Array();

import {wordData} from "./wordList.js";

function randomWord(){      //랜덤 연습모드를 위한 단어 랜덤하게 가져오기
    let random = Math.floor(Math.random()*(10000-1)+1);
    let arr = wordData[random];
    for (let i = 0; i < 20; i++) {
        random = Math.floor(Math.random()*(10000-1)+1);
        arr = arr + ' ' + wordData[random];
    }
    return arr;
};

setTimer.forEach(timer=>{   //연습시간 설정
    timer.addEventListener('click', ()=>{
        if(timer.checked){
        practiceTime = timer.value;
        timerElement.innerText = practiceTime;
    }
    })
})

function getPractice() {    //모드에 따라 가져오 단어 분리하기
    const word = randomWord();
    wordDisplayElement.innerText = '';
        word.split('').forEach((character) =>{
            const characterSpan = document.createElement('span');
            characterSpan.innerText = character;
            wordDisplayElement.appendChild(characterSpan);
        })
    wordInputElement.value = null;
};

const getResult =()=>{      //문자 입력 끝나면 단어, 입력 div 닫고 결과창 출력
    startTimer(0);
    resultDisplayElement.style.display='block';
    wordDisplayElement.style.display = 'none';
    wordInputElement.style.display = 'none';
    let result = `${errCnt} wrong word`
    resultDisplayElement.innerHTML= result;
}

function getRandomQuote() { //sample
    return fetch(RANDOM_QUOTE_APU_URL)
        .then(response => response.json())
        .then(data => data.content);
};

async function renderNewQuote() {   //sample
    const quote = await getRandomQuote();
    wordDisplayElement.innerText = '';
    word.split('').forEach(character =>{
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        wordDisplayElement.appendChild(characterSpan);
    })
    wordInputElement.value = null;
    startTimer(1);
};



wordInputElement.addEventListener('focus',()=>{         //input focus->start timer, input unfocused->stop timer and reset
    startTimer(1);
    wordInputElement.addEventListener('blur',()=>{
        startTimer(0);
    });
    

});


wordInputElement.addEventListener('input', () =>{       //인풋 이벤트 발생할 때마다 입력된 글자와 비교하여 색 wordDisplay에 색표시
    arrayWord = wordDisplayElement.querySelectorAll('span');
    arrayValue = wordInputElement.value.split('');
    let key;
    timeExTable = timeTable;
    // console.log(arrayValue);//이게 키포인트 인듯
    // console.log(arrayWord[arrayValue.length-1].innerText);
    let correct = true;
    arrayWord.forEach((characterSpan, index)=>{
        const character = arrayValue[index];
        // wordInputElement.addEventListener('keydown', (event)=>{
            //     key = event.keyCode;
            // })
            if(character == null){
                characterSpan.classList.remove('correct');
                characterSpan.classList.remove('incorrect');
                correct = false;
            }
            else if(character == ' ' && characterSpan.innerText == ' '){
                characterSpan.classList.add('space');
            }
            else if(character === characterSpan.innerText){
            timeTable[arrayValue.length-1]=new Date();
            timeTable[arrayValue.length-1]=timeTable[arrayValue.length-1].getTime();
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
        }
        // else if(arrayValue.length>=3){
        //     if(character != characterSpan.innerText && arrayWord[arrayValue.length-3].className=='fixed incorrect'){
        //         characterSpan.classList.add('incorrect');
        //     }
        //     else if(character != characterSpan.innerText && arrayWord[arrayValue.length-3].className=='incorrect'){
        //         characterSpan.classList.add('incorrect');        
        //     }
        //     else if(character != characterSpan.innerText && arrayWord[arrayValue.length-2].className=='correct'){
        //         characterSpan.classList.remove('correct');
        //         characterSpan.classList.add('incorrect');
        //         characterSpan.classList.add('fixed')
        //         correct = false;
        //     }
        // }
        else{
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
            characterSpan.classList.add('fixed')
            correct = false;
            timeTable[arrayValue.length-1]=0;
        }
        });

    if(arrayWord.length==arrayValue.length) {    //타이머가 0이거나 단어를 모두 입력하면 연습 종료
        countError();
        getResult();
        wordTime();
        console.log(`${errCnt} error detected`);
        console.log(arrayWord);
        }  //renderNewQuote()
        
    })
    
    restartElement.addEventListener('click', ()=>{  //재시작하는 버튼 재시작하고 다시 입력창을 focus해줘야 하는 불편함이 있음
        resultDisplayElement.style.display= 'none';
        wordDisplayElement.style.display = 'block';
        wordInputElement.style.display = 'block';
        errCnt = 0;
        timeTable=new Array;
        getPractice();
    });

    const countError = ()=>{                        //잘못 입력한 문자에 fixed 클래스 추가하여 결과를 보여줄 때 fixed 클래스 카운트하는 함수
        for (let i = 0; i < arrayWord.length; i++) {
            if(arrayWord[i].className.includes('fixed')){
                errCnt += 1;
            }
        }   
    }


    
    const wordTime = ()=>{                          //문자입력시간 분리
        for (let i = 1; i < arrayValue.length; i++) {
            timeTable[i]=timeExTable[i]-timeExTable[i-1]
        }
        console.log(timeExTable);
        console.log('\n');                         
        console.log(timeTable);
    };
    
    let startTime, timerInterval;
    const startTimer = (i)=>{                       //타이머
        timerElement.innerText = practiceTime;
        if (i==1) {
        startTime = new Date();
        timerInterval = setInterval(()=>{
        timerElement.innerText= practiceTime-getTimerTime();
        if(timerElement.innerText == 0) {countError(); getResult(); wordTime();} //if timer is 0 then stop practice and getResult
        }, 1000);
        } 
        else {
        clearInterval(timerInterval);
        return;
        }
    };

const getTimerTime = ()=>{                          //연습을 시작한 시간에서 현재 시간을 빼주는 함수
    return Math.floor((new Date() - startTime) /1000);
};

getPractice();