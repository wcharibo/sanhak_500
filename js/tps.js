const RANDOM_QUOTE_APU_URL = 'http://api.quotable.io/random';
const wordDisplayElement = document.querySelector('#wordDisplay');
const wordInputElement = document.querySelector('#wordInput');
const timerElement = document.querySelector('#timer');
const restartElement = document.querySelector('#restartBtn');
const resultDisplayElement = document.querySelector('#resultDisplay');
let errCnt = 0;
let backspaceCnt = 0;
let timerSet = 0;

import {wordData} from "./wordList.js";

function randomWord(){
    let random = Math.floor(Math.random()*(10000-1)+1);
    let arr = wordData[random];
    for (let i = 0; i < 1; i++) {
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
    let result = `${errCnt} wrong word and ${backspaceCnt} backspace`
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
    const arrayWord = wordDisplayElement.querySelectorAll('span');
    const arrayValue = wordInputElement.value.split('');
    console.log(arrayValue.length);//이게 키포인트 인듯
    console.log(arrayWord[arrayValue.length-1]);
    let correct = true;
    arrayWord.forEach((characterSpan, index)=>{
        const character = arrayValue[index];
        // wordInputElement.addEventListener('keydown', (event)=>{
        //     const key = event.key;
        //     if(key === 'Backspace') {backspaceCnt+=1;}
        // })
        if(character == null){
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            correct = false;
        }
        else if(character === characterSpan.innerText){
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
        }
        else if(arrayValue.length>=3){
            if(character != characterSpan.innerText && arrayWord[arrayValue.length-3].className=='fixed incorrect'){
                characterSpan.classList.add('incorrect');
            }
            else if(character != characterSpan.innerText && arrayWord[arrayValue.length-3].className=='incorrect'){
                characterSpan.classList.add('incorrect');
            }
            else if(character != characterSpan.innerText && arrayWord[arrayValue.length-2].className=='correct'){
                characterSpan.classList.remove('correct');
                characterSpan.classList.add('incorrect');
                characterSpan.classList.add('fixed')
                correct = false;
            }
        }
        else{
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
            characterSpan.classList.add('fixed')
            correct = false;
        }
    });

    if(correct) {
        for (let i = 0; i < arrayWord.length; i++) {
            if(arrayWord[i].className =='fixed correct'){
                errCnt += 1;
            }
        }   
            getResult();
            console.log(`${errCnt} error detected`);
        }  //renderNewQuote()
    })
    
    restartElement.addEventListener('click', ()=>{  //restart Button
        resultDisplayElement.style.display= 'none';
        wordDisplayElement.style.display = 'block';
        wordInputElement.style.display = 'block';
        errCnt = 0;
        getPractice();
    });
    
    let startTime, timerInterval;
    function startTimer(i){ //
        timerElement.innerText = 30;
        if (i==1) {
        startTime = new Date();
        timerInterval = setInterval(()=>{
        timerElement.innerText= 30-getTimerTime();
        if(timerElement.innerText == 0) getResult();    //if timer is 0 then stop practice and getResult
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