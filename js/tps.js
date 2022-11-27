const RANDOM_QUOTE_APU_URL = 'http://api.quotable.io/random';
const wordDisplayElement = document.querySelector('#wordDisplay');
const wordInputElement = document.querySelector('#wordInput');
const timerElement = document.querySelector('#timer');
const restartElement = document.querySelector('#restartBtn');
const resultDisplayElement = document.querySelector('#resultDisplay');
let arrayWord = wordDisplayElement.querySelectorAll('span');
let arrayValue = wordInputElement.value.split('');
let errCnt = 0;
let backspaceCnt = 0;
let timeTable = new Array();
let timeCnt=0;

import {wordData} from "./wordList.js";

function randomWord(){
    let random = Math.floor(Math.random()*(10000-1)+1);
    let arr = wordData[random];
    for (let i = 0; i < 20; i++) {
        random = Math.floor(Math.random()*(10000-1)+1);
        arr = arr + ' ' + wordData[random];
    }
    return arr;
};


function getPractice() {
    const word = randomWord();
    wordDisplayElement.innerText = '';
        word.split('').forEach((character) =>{
            const characterSpan = document.createElement('span');
            characterSpan.innerText = character;
            wordDisplayElement.appendChild(characterSpan);
        })
    wordInputElement.value = null;
};

const getResult =()=>{
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



wordInputElement.addEventListener('focus',()=>{     //input focus->start timer, input unfocused->stop timer and reset
    startTimer(1);
    wordInputElement.addEventListener('blur',()=>{
        startTimer(0);
    });
    

});


wordInputElement.addEventListener('input', () =>{  //check every input
    arrayWord = wordDisplayElement.querySelectorAll('span');
    arrayValue = wordInputElement.value.split('');
    let key;
    // console.log(arrayValue);//이게 키포인트 인듯
    // console.log(arrayWord[arrayValue.length-1].innerText);
    let correct = true;
    timeTable[timeCnt]=new Date();
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
            timeTable[timeCnt]=0;
        }
        });

    if(arrayWord.length==arrayValue.length || timerElement.innerText == 0) {
        countError();
        getResult();
        wordTime();
        console.log(`${errCnt} error detected`);
        console.log(arrayWord);
        }  //renderNewQuote()
        timeCnt+=1;
    })
    
    restartElement.addEventListener('click', ()=>{  //restart Button
        resultDisplayElement.style.display= 'none';
        wordDisplayElement.style.display = 'block';
        wordInputElement.style.display = 'block';
        errCnt = 0;
        timeTable=new Array;
        timeCnt = 0;
        getPractice();
    });

    const countError = ()=>{
        for (let i = 0; i < arrayWord.length; i++) {
            if(arrayWord[i].className.includes('fixed')){
                errCnt += 1;
            }
        }   
    }

    function wordTime(){
        console.log(timeTable);
    };
    
    let startTime, timerInterval;
    function startTimer(i){ //
        timerElement.innerText = 30;
        if (i==1) {
        startTime = new Date();
        timerInterval = setInterval(()=>{
        timerElement.innerText= 30-getTimerTime();
        if(timerElement.innerText == 0) {countError(); getResult();} //if timer is 0 then stop practice and getResult
        }, 1000);
        } 
        else {
        clearInterval(timerInterval);
        return;
        }
    }

function getTimerTime(){
    return Math.floor((new Date() - startTime) /1000);
}

getPractice();
//renderNewQuote()