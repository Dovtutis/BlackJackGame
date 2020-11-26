
const drawCardButton = document.getElementById('drawCardButton').onclick = drawCard
const userCard1 = document.getElementById('userCard1')
const userCard2 = document.getElementById('userCard2')
const userCard3 = document.getElementById('userCard3')
const userCard4 = document.getElementById('userCard4')
const pcCard1 = document.getElementById('pcCard1')
const pcCard2 = document.getElementById('pcCard2')
const pcCard3 = document.getElementById('pcCard3')
const userPoints = document.getElementById('userPoints')
const userBalance = document.getElementById('userBalance')
const sumBet = document.getElementById('sumBet')
const resultButton = document.getElementById('resultButton').onclick = revealResult
const betButtonMinus = document.getElementById('betButtonMinus').onclick = minusBet
const betButtonPlus = document.getElementById('betButtonPlus').onclick = addBet
const gameHistory = document.getElementById('gameHistory')
const reshuffle = document.getElementById('reshuffle').onclick = newDeal
const confirmBet = document.getElementById('confirmBet').onclick = gameStart

let deckId = ""
let pcCards = []
let userCards = []
let drawCardCounter = 0
let userPointsCounter = 0
let pcPointsCounter = 0
let money = 5000
let bet = 100
let winner = ""
let userHistory = ""
let pcHistory = ""
let gameCounter = 0
let userAceCounter = 0
let pcAceCounter = 0

userBalance.innerText = `Your money: ${money}`
sumBet.innerText = `Your bet: ${bet}`


fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(response => response.json())
    .then(data => {
        deckId = data.deck_id
        console.log(deckId)
})


function gameStart(){
    pcCards = []
    userCards = []
    pcCard3.removeAttribute("src")
    userCard3.removeAttribute("src")
    userCard4.removeAttribute("src")

    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            userCards.unshift(data)

            pcAceCounter = 0
            userAceCounter = 0
            drawCardCounter = 0
            userPointsCounter = 0
            pcPointsCounter = 0
            userHistory = ""
            pcHistory = ""

            userCard1.setAttribute("src", "")
            userCard1.src = userCards[0].cards[0].image
            userHistory += userCards[0].cards[0].code + ", "
            checkValue (userCards[0].cards[0].value,true)

            userCard2.setAttribute("src", "")
            userCard2.src = userCards[0].cards[1].image
            userHistory += userCards[0].cards[1].code + ", "
            checkValue (userCards[0].cards[1].value, true)

            console.log("User points: " + userPointsCounter)
            console.log(userCards)

        })

    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
        .then(response => response.json())
        .then(data => {
            console.log(data)

            pcCards.unshift(data)
            pcCard1.src = "https://i.ibb.co/0MCkffq/cardBack.jpg"
            pcHistory += pcCards[0].cards[0].code + ", "
            checkValue (pcCards[0].cards[0].value, false)
            pcCard2.src = "https://i.ibb.co/0MCkffq/cardBack.jpg"
            pcHistory += pcCards[0].cards[1].code + ", "
            checkValue (pcCards[0].cards[1].value, false)

            drawPcCard()

            console.log("PC points: " + pcPointsCounter)
            console.log(pcCards)
        })
}

function drawCard () {

    if (drawCardCounter===1){
        fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
            .then(response => response.json())
            .then(data => {
                userCards.push(data)
                userCard4.setAttribute("src", "")
                userCard4.src = userCards[2].cards[0].image
                userHistory += userCards[1].cards[0].code + "."
                checkValue (userCards[2].cards[0].value, true)
                drawCardCounter = 2

                checkAceValue (true)

                console.log("User points: " + userPointsCounter)
                console.log(userCards)
            })
    }
    if (drawCardCounter===0){
        fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
            .then(response => response.json())
            .then(data => {
                userCards.push(data)
                userCard3.setAttribute("src", "")
                userCard3.src = userCards[1].cards[0].image
                userHistory += userCards[1].cards[0].code + ", "
                drawCardCounter = 1
                checkValue (userCards[1].cards[0].value, true)

                checkAceValue (true)

                console.log("User points: " + userPointsCounter)
                console.log(userCards)
            })
    }

    if (pcCards.length > 1) {
        pcCard3.setAttribute("src", "")
        pcCard3.src = "https://i.ibb.co/0MCkffq/cardBack.jpg"
    }
}

function drawPcCard () {
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
        .then(response => response.json())
        .then(data => {
            if (pcPointsCounter < 16){
                pcCards.push(data)
                pcHistory += pcCards[1].cards[0].code + "."
                checkValue (pcCards[1].cards[0].value, false)

                checkAceValue (false)

                console.log("PC points: " + pcPointsCounter)
            }
        })
}

function checkValue (value, user) {
    if (value === "ACE") {
        if (user ? userPointsCounter <= 10 : pcPointsCounter <= 10) {
            user ? userPointsCounter += 11 : pcPointsCounter += 11
            user ? userAceCounter = 1 : pcAceCounter = 1
            user ? userPoints.innerText = `Your points: ${userPointsCounter}` : null
            return
        } else {
            user ? userPointsCounter +=1 : pcPointsCounter +=1
            user ? userPoints.innerText = `Your points: ${userPointsCounter}` : null
            return
        }
    }
    if (value ==="JACK" || value ==="QUEEN" || value ==="KING") {
        user ? userPointsCounter += 10 : pcPointsCounter += 10
        user ? userPoints.innerText = `Your points: ${userPointsCounter}` : null
        return
    }
        user ? userPointsCounter += Number(value) : pcPointsCounter += Number(value)
        user ? userPoints.innerText = `Your points: ${userPointsCounter}` : null
}


function revealResult (){


    pcCard1.src = pcCards[0].cards[0].image
    pcCard2.src = pcCards[0].cards[1].image

    if (pcCards.length > 1) {
        pcCard3.setAttribute("src", "")
        pcCard3.src = pcCards[1].cards[0].image
    }

    if (userPointsCounter < 22 && pcPointsCounter < 22) {
        if (userPointsCounter > pcPointsCounter) {
            alert("YOU WON!")
            winner ="User won."
            money += bet * 2
            userBalance.innerText = `Your money: ${money}`
        }
        if (userPointsCounter < pcPointsCounter){
            alert("YOU LOST!")
            winner ="PC won."
            money -= bet
            userBalance.innerText = `Your money: ${money}`
        }
        if (userPointsCounter === pcPointsCounter){
            alert("DRAW!")
            winner ="Draw."
        }
    }

    if (userPointsCounter > 21 && pcPointsCounter < 22) {
        alert("YOU LOST!")
        winner ="PC won."
        money -= bet
        userBalance.innerText = `Your money: ${money}`
    }

    if (pcPointsCounter > 21 && userPointsCounter < 22) {
        alert("YOU LOST!")
        winner ="PC won."
        money -= bet
        userBalance.innerText = `Your money: ${money}`
    }

    if (userPointsCounter > 22 && pcPointsCounter > 22) {
        alert("DRAW!")
        winner ="Draw."
    }


    gameCounter++

    let history = document.createElement('div')
    history.innerHTML = "Game: " + gameCounter + " Result: " + winner + "<br>" + " User had " + userHistory + " and collected "
        + userPointsCounter + " points. " + "<br>" + "PC had " + pcHistory + " and collected "
        + pcPointsCounter + " points."
    gameHistory.appendChild(history)
}

function addBet () {
    bet += 100
    sumBet.innerText = `Your bet: ${bet}`
}

function minusBet () {
    bet -= 100
    sumBet.innerText = `Your bet: ${bet}`
}


function newDeal () {
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`)
        .then(response => response.json())
        .then(data => gameStart())
}


function checkAceValue (user) {
    if (userPointsCounter > 21 && userAceCounter === 1) {
        user ? userPointsCounter -= 10 : pcPointsCounter -=10
        user ? userAceCounter = 0 : userAceCounter = 0
        user ? userPoints.innerText = `Your points: ${userPointsCounter}` : null
    }
}





