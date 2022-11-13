const RANDOM_QUOTE_APU_URL = 'http://api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const timerElement = document.getElementById('timer')

import {wordData} from "./wordList.js"

console.log(wordData[1])

function getRandomQuote() { //sample
    return fetch(RANDOM_QUOTE_APU_URL)
        .then(response => response.json())
        .then(data => data.content)
}

async function renderNewQuote() {   //sample
    const quote = await getRandomQuote()
    quoteDisplayElement.innerText = ''
    quote.split('').forEach(character =>{
        const characterSpan = document.createElement('span')
        characterSpan.innerText = character
        quoteDisplayElement.appendChild(characterSpan)
    })
    quoteInputElement.value = null
    startTimer()
}

quoteInputElement.addEventListener('input', () =>{  //check every input
const arrayQuote = quoteDisplayElement.querySelectorAll('span')
const arrayValue = quoteInputElement.value.split('')

let correct = true
arrayQuote.forEach((characterSpan, index)=>{
    const character = arrayValue[index]
    if(character == null){
        characterSpan.classList.remove('correct')
        characterSpan.classList.remove('incorrect')
        correct = false
    }
    else if(character === characterSpan.innerText){
        characterSpan.classList.add('correct')
        characterSpan.classList.remove('incorrect')
    }
    else{
        characterSpan.classList.remove('correct')
        characterSpan.classList.add('incorrect')
        correct = false
    }
    })

    if(correct) getPractice()//renderNewQuote()
})

let startTime
function startTimer(){
    timerElement.innerText = 0
    startTime = new Date()
    setInterval(()=>{
        timer.innerText=getTimerTime()
    }, 1000)
}

function getTimerTime(){
    return Math.floor((new Date() - startTime) /1000)
}

getPractice()
//renderNewQuote()