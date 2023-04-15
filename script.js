import supabase from "./config/supabaseClient";

const input = document.getElementById('input');
const searchBtn = document.getElementById('search-btn');
const notFound = document.querySelector('.not-found');
const definitionBox = document.querySelector('.def');
const audioBox = document.querySelector('.audio');

const keyboard = document.querySelector('.keyboard')
const keyboardRows = document.querySelectorAll('.keyboard-row')
const tileBoard = document.querySelector('.tile-container')

const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".btn-close");
const openModalBtn = document.querySelector(".btn-open");

const keys =  [['Q','W','E','R','T','Y','U','I','O','P'], 
            ['A','S','D','F','G','H','J','K','L'], 
            ['ENTER','Z','X','C','V','B','N','M','«']]
const guesses = []
let guessCount = 0
let word = "ward".toUpperCase();
let gameOver = false;
let currentTile = 0;
let currentRow = 0;


async function dataGet() {
    audioBox.innerHTML = "";
    notFound.innerText = "";
    definitionBox.innerText = "";
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`);
    const data = await response.json();
    console.log(response);
    if (!data.length) {
        notFound.innerText = 'No result found';
        return;
    }
    let definition = data[0].shortdef[0];// find the result
    definitionBox.innerText = definition;
    let sound_name = data[0].hwi.prs[0].sound.audio;
    if (sound_name) { // if sound is available
        soundRender(sound_name);
    }
}

function setupKeyboard(){
    keyboardRows.forEach((row, rowIndex) => {
        keys[rowIndex].forEach(key => {
        const newButton = document.createElement('button')
        newButton.textContent = key
        newButton.setAttribute('id', key)
        newButton.addEventListener('click', () => handleClick(key))
        row.append(newButton)
        })
    })
}

const pushRow = () => {
    const newRow = document.createElement('div')
    newRow.setAttribute('id', 'guessRow-' + currentRow);
    blankGuess = [];
    for (let col = 0; col < word.length; col++) {
        const newTile = document.createElement('div');
        newTile.setAttribute('id', 'guessRow-' + currentRow + '-tile-' + col);
        newTile.classList.add('tile');
        newRow.append(newTile);
        blankGuess.push('');
    }
    tileBoard.append(newRow);
    guesses.push(blankGuess);
}

const closeModal = () => {modal.classList.add("hidden");}
closeModalBtn.addEventListener("click", closeModal);
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {closeModal();}
});
const openModal = function () {modal.classList.remove("hidden");};
openModalBtn.addEventListener("click", openModal);

function setup(){
    // dataGet();
    pushRow();
    setupKeyboard();
}
setup();


const handleClick = (letter) => {
    console.log(letter)
    if (!gameOver) {
        if (letter === '«') {deleteLetter();}
        else if (letter === 'ENTER') {checkGuess();}
        else {addLetter(letter);}
    }
}

const addLetter = (letter) => {
    if (currentTile < word.length) {
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
        tile.textContent = letter;
        guesses[currentRow][currentTile] = letter;
        tile.setAttribute('data', letter);
        currentTile++;
    }
}

const deleteLetter = () => {
    if (currentTile > 0) {
        currentTile--;
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
        tile.textContent = '';
        guesses[currentRow][currentTile] = '';
        tile.setAttribute('data', '');
    }
}

const checkGuess = () => {
    const guess = guesses[currentRow].join('')
    console.log(guess)
    if (currentTile == word.length) {
        console.log("same length")
        console.log(word, guess)
        checkTiles(guess == word)
        if (word == guess) {
            // showMessage('Magnificent!')
            console.log("CORRECT")
            openModal();
            gameOver = true
            return
        } else {
            currentRow++;
            currentTile = 0;
            pushRow();
        }
    }
}

const checkTiles = (wordGuessed) => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes
    let checkword = word
    const guess = []
    rowTiles.forEach(tile => {guess.push({letter: tile.getAttribute('data'), color: 'grey-overlay'})})
    guess.forEach((char, index) => {
        if(wordGuessed){
            if (char.letter == word[index]) {
                char.color = 'green-overlay'
                checkword = checkword.replace(char.letter, '')
            }
        }
        else{
            if (checkword.includes(char.letter)) {
                char.color = 'yellow-overlay'
                checkword = checkword.replace(char.letter, '')
            }
        }
    })
    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip')
            tile.classList.add(guess[index].color)
            addColorToKey(guess[index].letter, guess[index].color)
        }, 500 * index)
    })
}

const addColorToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter)
    key.classList.add(color)
}

function soundRender(sound_name) {
    let sub_folder = sound_name.charAt(0);
    let sound_src = `https://media.merriam-webster.com/soundc11/${sub_folder}/${sound_name}.wav?key=${apiKey}`;
    let aud = document.createElement('audio');
    aud.src = sound_src;
    aud.controls = true;
    audioBox.appendChild(aud)
}

