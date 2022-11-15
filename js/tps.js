const RANDOM_QUOTE_APU_URL = 'http://api.quotable.io/random';
const wordDisplayElement = document.querySelector('#wordDisplay');
const wordInputElement = document.querySelector('#wordInput');
const timerElement = document.querySelector('#timer');
const restartElement = document.querySelector('#restartBtn');
let errorCnt =0;

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
    word.split('').forEach(character =>{
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        wordDisplayElement.appendChild(characterSpan);
    })
    wordInputElement.value = null;
};

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
const arrayWord = wordDisplayElement.querySelectorAll('span');
const arrayValue = wordInputElement.value.split('');

let correct = true;
arrayWord.forEach((characterSpan, index)=>{
    const character = arrayValue[index];
    // console.log(character);
    if(character == null){
        characterSpan.classList.remove('correct');
        characterSpan.classList.remove('incorrect');
        correct = false;
    }
    else if(character === characterSpan.innerText){
        characterSpan.classList.add('correct');
        characterSpan.classList.remove('incorrect');
    }
    else{
        characterSpan.classList.remove('correct');
        characterSpan.classList.add('incorrect');
        correct = false;
        errorCnt = errorCnt + 1;
    }
    });

    if(correct) {console.log(errorCnt);}  //renderNewQuote()
})

restartElement.addEventListener('click', ()=>{  //restart Button
    getPractice();
});

let startTime, t;
function startTimer(i){
    timerElement.innerText = 0;
    if (i==1) {
        startTime = new Date();
    t = setInterval(()=>{
    timer.innerText=getTimerTime();
    }, 1000);
    } else {
        clearInterval(t);
        return;
    }
}

function getTimerTime(){
    return Math.floor((new Date() - startTime) /1000);
}

getPractice();
//renderNewQuote()