// constant global variables go here
const cards = document.querySelectorAll('.card');
const btns = document.querySelectorAll('.screen button');
// Variables for opening/closing screen
let screens = document.querySelectorAll('.screen');
let gameOver_screen = document.querySelector('.gameOver');
// variables to change the html info
let timer_p = document.getElementById('timer');
let finishedTime_p = document.getElementById('finishedTime');
let endMessage_p = document.getElementById("endMessage");
let matches_p = document.getElementById('match');
let flips_p = document.getElementById('flips');
// all counter start values
let seconds = 0, minutes = 0, hours = 0, t;
let matches = 0;
let flips = 0;
let matchedCards = 0;
// Declares firstCard, secondCard (for some reason when declared in flipCard function breaks unflipCard function)
let firstCard, secondCard;
// sets initial value for if the card has been flipped and if the board needs to be locked so that double clicking on a card won't break the game.
let hasFlippedCard = false;
let lockBoard = false;
// sets initial scores array
let scores = [];


// When either of the screen buttons are clicked start game
btns.forEach(btn => btn.addEventListener('click', function(){
    // for each screen add hide class when btn is clicked
    screens.forEach(screen => {screen.classList.add('hide');});
    // clears number of flips, number of matched cards, and makes the flips p tag equal 0
    flips = 0;
    matchedCards = 0;
    flips_p.textContent = "0";
    // removes flip class from all cards.
    cards.forEach(card => {card.classList.remove("flip")});
    // clears timer 
    clearTimer();
    // start the game Yeah!!!
    game();
}));


// This will clear the timer when screen button is pressed
function clearTimer() {
    timer_p.textContent = "00:00:00";
    seconds = 0; minutes = 0; hours = 0;
}

//This function starts the game
function game() {
    // calls function to shuffle the cards and start the timer
    shuffleCards();
    startTimer();
    // gives you the current match that you are on, game starts at match 1
    matches++;
    matches_p.textContent = matches;
    // listens for a card to be clicked and calls the flipCard function
    cards.forEach(card => {card.addEventListener('click', flipCard)});
}

// This function starts the timer for the game
function startTimer(){
    t = setTimeout(timer, 1000)
}

// This function gets the timer and starts it
function timer() {
    // adds second to counter
    seconds++;
    // if the sceonds are more than 60 then add to minutes and make seconds 0, if minutes are greater than 60 than add to hours and minutes equal 0.
    if(seconds >= 60){
        seconds = 0;
        minutes++;
        if(minutes >= 60){
            minutes =0;
            hours++;
        }
    }
    /* get timer text. 
    If the hours are less than 9 make hours equals 0 + hours if not hours equal 00.
    If the minutes are less than 9 make minutes equals 0 + minutes if not minutes equal 00.    
    If the seconds are less than 9 make seconds equals 0 + seconds if not seconds equal 00. */
    timer_p.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds ? (seconds > 9 ? seconds : "0" + seconds) : "00");
    // start the timer
    startTimer();
}

// this will flip the card
function flipCard() {
    /* lockBoard is true then return nothing.
    If this clicked card is the firstCard then when it is clicked again return firstCard 
    so that it is not set as the second card.*/
    if (lockBoard) return;
    if (this === firstCard) return;
    // when card is click add flip class
    this.classList.toggle('flip');
    // add to flips counter
    flips++;
    flips_p.textContent = flips;
    // if any cards has not been flipped then set has been flipped to true and set firstCard to the card that was clicked and return.
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    // if any card has been flipped then set clicked card to secondCard
    secondCard = this;
    // check to see if both cards match
    checkMatch();
}

// check to see if both cards match
function checkMatch() {
    // if firstCard equals secondCard then disable both cards click events else remove flip class.
    if (firstCard.dataset.card === secondCard.dataset.card){
        disableCards();
    } else {
        unflipCards();
    }
}

// disable cards from being clicked again
function disableCards(){
    // removes ability to flip the cards back over.
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    // add to matched cards counter
    matchedCards++;
    // reset the board 
    resetBoard();
}

// unflips the cards
function unflipCards() {
    // set lockBoard to true so that no cards can be clicked until board is reset.
    lockBoard = true;
    // set timeout so that you can see the second card flipped. remove the flip class, and reset the board after 1500ms.
    setTimeout ( () => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

// resets the board so that no card has been flipped, board is not locked, and first/second cards equal nothing.
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
    // if all the cards have been matched then start gameOver function.
    if (matchedCards === 9) {
        gameOver();
    }
}

// starts gameOver actions
function gameOver() {
        // stops timer, gets you end time, and puts into your finished times.
        stopTimer();
        endScore();
        getScore(finishedTime_p.textContent);
        // removes the hide class.
        gameOver_screen.classList.remove('hide');
}

// This function will stop the timer
function stopTimer(){
    clearTimeout(t);
}

// This will get the end timer and put it on to the game over screen and give you a message based on your score.
function endScore() {
    // splits the time into an array and gets the time in seconds.
    let finishedTimeArray = finishedTime_p.textContent.split(":");
    let finishedTimeSeconds = (+finishedTimeArray[0]) * 60 * 60 + (+finishedTimeArray[1]) * 60 + (+finishedTimeArray[2]);
    // get the end timer and put it on to the game over screen
    finishedTime_p.textContent = timer_p.textContent; 
    /* 
    if finished time seconds are greater than 180 seconds then end message is You're slower than Frosty on a sunny day.
    if finished time seconds are greater than 120 seconds then end message is Come on you can match faster. Think of the cookies you will get if you win!
    if finished time seconds are greater than 60 seconds then end message is Not the fastest but still pretty good.
    if finished time seconds are less than 30 seconds then end message is Wow you're really good at this!
    */
    if( finishedTimeSeconds >= 180){
        endMessage_p.textContent = "You're slower than Frosty on a sunny day.";
    } else if (finishedTimeSeconds >= 120){
        endMessage_p.textContent = "Come on you can match faster. Think of the cookies you will get if you win!";
    }else if (finishedTimeSeconds >= 60) {
        endMessage_p.textContent = "Not the fastest but still pretty good.";
    } else if (finishedTimeSeconds < 30) {
        endMessage_p.textContent = "Wow you're really good at this!";
    }
}

// Gets your finished time and puts it into an array
function getScore(score){
    // set li to nothing and gets the ordered list.
    let li = "";
    let ol = document.getElementById('bestTimes');
    /* 
    if you have less than 5 scores then it will put you score into the array and sort it so shortest time is on top.
    for each score put it into an li tag and put it into the ordered list.
    else if you have more than 5 scores then put you score into the array, sort it so shortest time is on top and take off last score.
    */
    if (scores.length < 5){
        scores.push(score);
        scores.sort();
        for (var i =0; i < scores.length; i++) {
            li += `<li> ${scores[i]} </li>`;
        }
        ol.innerHTML = li;
    }
    else if (scores.length = 5){
        scores.push(score);
        scores.sort();
        scores.pop();

        for (var i =0; i < scores.length; i++) {
           li += `<li> ${scores[i]} </li>`;
        }
        ol.innerHTML = li;
    }
}

// for each card get a random number than set the cards flex order to that random number.
function shuffleCards() {
    cards.forEach(card => {
        let randomCard = Math.floor(Math.random()*18);
        card.style.order = randomCard;
    });
}