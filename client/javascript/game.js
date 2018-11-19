$(document).ready(function () {
    // make connection
    var socket = io.connect('http://localhost:4000');
    // query dom buttons
    var gameSendBtn = $('#game-send-btn')[0];
    var startGameBtn = $('#start-game-btn')[0];
    // query dom form input fields
    var gameMessageField = $('#game-message-input')[0];
    // query dom form output fields
    var gameChatOutput = $('#game-chat-output')[0];
    var gameTypingDetector = $('#game-typing-detector')[0];
    // query dom player circles
    var playerOne = $('#player-one')[0];
    var playerTwo = $('#player-two')[0];
    var playerThree = $('#player-three')[0];
    var playerFour = $('#player-four')[0];
    // query dom for player point columns
    var playerOneColumn = $('#player-one-column')[0];
    var playerTwoColumn = $('#player-two-column')[0];
    var playerThreeColumn = $('#player-three-column')[0];
    var playerFourColumn = $('#player-four-column')[0];
    // query dom cards
    var cardOne = $('#card-one');
    var cardTwo = $('#card-two');
    var cardThree = $('#card-three');
    var cardFour = $('#card-four');
    var cardFive = $('#card-five');
    var deckFront = $('#deck-front');
    var deckBack = $('#deck-back')[0];
    // retrieve player object from local storage
    var urlString = window.location.href;
    var url = new URL(urlString);
    var playerKey = url.searchParams.get("name");
    var tableKey = url.searchParams.get("table");
    var player = JSON.parse(localStorage.getItem(playerKey));
    var thisTable = JSON.parse(localStorage.getItem(tableKey));

    // create array for players and their cards
    var initialPlayerCards = new Array();
    // array of my current cards
    var myCurrentCards = new Array();
    // array of cards to be swaped
    var swapArray = new Array();

    // function to find index by key value pairs
    function findIndexByKeyValue(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] == value) {
                return i;
            }
        }
        return -1;
    }

    // game container listeners
    gameSendBtn.addEventListener('click', function () {
        socket.emit('game-chat', {
            message: gameMessageField.value,
            handle: player['username']
        });
    })

    // card listeners
    $('.game-card').each(function () {
        var thisCard = $(this)[0];
        thisCard.addEventListener('click', function () {
            if ($(this).hasClass('hover')) {
                cardToSwap(thisCard.id);
                thisCard.classList.add('selected');
                thisCard.classList.remove('hover');
                console.log(swapArray);
            } else if ($(this).hasClass('selected')) {
                changedSwapMind(thisCard.id);
                thisCard.classList.remove('selected');
                thisCard.classList.add('hover');
                console.log(swapArray);
            }
        })
    })
    // add card indexes that will be swaped to an array
    function cardToSwap(card) {
        if (card == 'card-one') {
            swapArray.push(0);
        } else if (card == 'card-two') {
            swapArray.push(1);
        } else if (card == 'card-three') {
            swapArray.push(2);
        } else if (card == 'card-four') {
            swapArray.push(3);
        } else if (card == 'card-five') {
            swapArray.push(4);
        }
    }
    // remove card indexes from swap array
    function changedSwapMind(card) {
        if (card == 'card-one') {
            swapArray.splice(swapArray.indexOf(0), 1);
        } else if (card == 'card-two') {
            swapArray.splice(swapArray.indexOf(1), 1);
        } else if (card == 'card-three') {
            swapArray.splice(swapArray.indexOf(2), 1);
        } else if (card == 'card-four') {
            swapArray.splice(swapArray.indexOf(3), 1);
        } else if (card == 'card-five') {
            swapArray.splice(swapArray.indexOf(4), 1);
        }
    }
    // display new card
    function displayNewCard(card, index) {
        if (index == 0) {
            cardOne.css('background-image', 'url("../assets/cards/' + card + '.png")');
        } else if (index == 1) {
            cardTwo.css('background-image', 'url("../assets/cards/' + card + '.png")');
        } else if (index == 2) {
            cardThree.css('background-image', 'url("../assets/cards/' + card + '.png")');
        } else if (index == 3) {
            cardFour.css('background-image', 'url("../assets/cards/' + card + '.png")');
        } else if (index == 4) {
            cardFive.css('background-image', 'url("../assets/cards/' + card + '.png")');
        }
    }
    // display players in their seats 
    function seatPlayers(playerArray) {
        if (playerArray.length == 1) {
            playerOne.innerHTML = '<p>' + playerArray[0].pointsOnHand + '<br />points</p>'
            playerOneColumn.innerHTML = '<p><strong>' + playerArray[0].username + '</strong></p>'
        } else if (playerArray.length == 2) {
            playerOne.innerHTML = '<p>' + playerArray[0].pointsOnHand + '<br />points</p>'
            playerOneColumn.innerHTML = '<p><strong>' + playerArray[0].username + '</strong></p>'
            playerTwo.innerHTML = '<p>' + playerArray[1].username + '<br />' + playerArray[1].cardsOnHand.length + ' cards</p>'
            playerTwoColumn.innerHTML = '<p><strong>' + playerArray[1].username + '</strong></p>'
        } else if (playerArray.length == 3) {
            playerOne.innerHTML = '<p>' + playerArray[0].pointsOnHand + '<br />points</p>'
            playerOneColumn.innerHTML = '<p><strong>' + playerArray[0].username + '</strong></p>'
            playerTwo.innerHTML = '<p>' + playerArray[1].username + '<br />' + playerArray[1].cardsOnHand.length + ' cards</p>'
            playerTwoColumn.innerHTML = '<p><strong>' + playerArray[1].username + '</strong></p>'
            playerThree.innerHTML = '<p>' + playerArray[2].username + '<br />' + playerArray[2].cardsOnHand.length + ' cards</p>'
            playerThreeColumn.innerHTML = '<p><strong>' + playerArray[2].username + '</strong></p>'
        } else if (playerArray.length == 4) {
            playerOne.innerHTML = '<p>' + playerArray[0].pointsOnHand + '<br />points</p>'
            playerOneColumn.innerHTML = '<p><strong>' + playerArray[0].username + '</strong></p>'
            playerTwo.innerHTML = '<p>' + playerArray[1].username + '<br />' + playerArray[1].cardsOnHand.length + ' cards</p>'
            playerTwoColumn.innerHTML = '<p><strong>' + playerArray[1].username + '</strong></p>'
            playerThree.innerHTML = '<p>' + playerArray[2].username + '<br />' + playerArray[2].cardsOnHand.length + ' cards</p>'
            playerThreeColumn.innerHTML = '<p><strong>' + playerArray[2].username + '</strong></p>'
            playerFour.innerHTML = '<p>' + playerArray[3].username + '<br />' + playerArray[3].cardsOnHand.length + ' cards</p>'
            playerFourColumn.innerHTML = '<p><strong>' + playerArray[3].username + '</strong></p>'
        }
    }
    // sort players array
    function sortPlayers(unsortedArray) {
        var playerIndex = findIndexByKeyValue(unsortedArray, 'username', player['username']);
        var sortedArray = new Array();
        sortedArray.push(player);
        if (unsortedArray.length == 1) {
            sortedArray = unsortedArray
        } else if (unsortedArray.length == 2) {
            if (playerIndex == 1) {
                sortedArray.push(unsortedArray[0]);
            } else {
                sortedArray = unsortedArray;
            }
        } else if (unsortedArray.length == 3) {
            if (playerIndex == 1) {
                sortedArray.push(unsortedArray[2]);
                sortedArray.push(unsortedArray[0]);
            } else if (playerIndex == 2) {
                sortedArray.push(unsortedArray[0]);
                sortedArray.push(unsortedArray[1]);
            } else {
                sortedArray = unsortedArray;
            }
        } else if (unsortedArray.length == 4) {
            if (playerIndex == 1) {
                sortedArray.push(unsortedArray[2]);
                sortedArray.push(unsortedArray[3]);
                sortedArray.push(unsortedArray[0]);
            } else if (playerIndex == 2) {
                sortedArray.push(unsortedArray[3]);
                sortedArray.push(unsortedArray[0]);
                sortedArray.push(unsortedArray[1]);
            } else if (playerIndex == 3) {
                sortedArray.push(unsortedArray[0]);
                sortedArray.push(unsortedArray[1]);
                sortedArray.push(unsortedArray[2]);
            } else {
                sortedArray = unsortedArray;
            }
        }
        seatPlayers(sortedArray);
    }
    // shuffle deck of cards 
    function shuffleCards(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    // hand out cards to everyone
    function dealCards(unsortedPlayerArray) {
        // deal table cards
        var initialOpeningCard = thisTable['cards'].pop();
        deckFront.css('background-image', 'url("../assets/cards/' + initialOpeningCard + '.png")');
        // deal player cards
        for (var i = 0; i < unsortedPlayerArray.length; i++) {
            for (var j = 0; j < 5; j++) {
                var poppedCard = thisTable['cards'].pop();
                unsortedPlayerArray[i].cardsOnHand.push(poppedCard);
            }
            initialPlayerCards.push({
                "username": unsortedPlayerArray[i].username,
                "cardsOnHand": unsortedPlayerArray[i].cardsOnHand
            });
        }
    }
    // display players cards on hand
    function displayCardsOnHand(cardArray) {
        cardOne.css('background-image', 'url("../assets/cards/' + cardArray[0] + '.png")');
        cardTwo.css('background-image', 'url("../assets/cards/' + cardArray[1] + '.png")');
        cardThree.css('background-image', 'url("../assets/cards/' + cardArray[2] + '.png")');
        cardFour.css('background-image', 'url("../assets/cards/' + cardArray[3] + '.png")');
        cardFive.css('background-image', 'url("../assets/cards/' + cardArray[4] + '.png")');
    }
    // pick up a random card from the deck
    function pickUpRandomCard() {
        var randomCard = thisTable['cards'].pop();
        var selectedCardIndex = swapArray[0];
        var selectedCard = myCurrentCards.splice(selectedCardIndex, 1, randomCard);
        // myCurrentCards.push(randomCard);
        displayNewCard(randomCard, selectedCardIndex);
        deckFront.css('background-image', 'url("../assets/cards/' + selectedCard + '.png")');
    }
    // do the initial setup for the game
    function setupTable() {
        sortPlayers(thisTable['players']);
    }

    window.onload = setupTable();
    // send to everyone the same shuffled deck of cards
    startGameBtn.addEventListener('click', function () {
        shuffleCards(thisTable['cards']);
        dealCards(thisTable['players']);
        socket.emit('shuffled-deck', {
            deck: thisTable['cards'],
            cards: initialPlayerCards
        });
        startGameBtn.classList.add('hidden');
        deckFront[0].classList.remove('hidden');
        deckBack.classList.remove('hidden');
    })
    // add event listener for when someone wants to pick up a random card from the deck
    deckBack.addEventListener('click', function () {
        pickUpRandomCard();
    })
    // add event listener for when someone starts typing
    gameMessageField.addEventListener('keypress', function () {
        socket.emit('player-typing', player["username"]);
    })
    //
    socket.on('shuffled-deck', function (data) {
        thisTable['cards'] = data.deck;
        for (var i = 0; i < data.cards.length; i++) {
            if (player['username'] == data.cards[i].username) {
                myCurrentCards = data.cards[i].cardsOnHand;
            }
        }
        displayCardsOnHand(myCurrentCards);
    })

    socket.on('game-chat', function (data) {
        gameTypingDetector.innerHTML = '';
        gameChatOutput.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
    })

    socket.on('player-typing', function (data) {
        gameTypingDetector.innerHTML = '<p><em>' + data + ' is typing...</em></p>';
    })
});