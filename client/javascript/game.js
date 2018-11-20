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

    // card point value array
    var cardPointValues = [{
        'rank': 'joker',
        'value': 0
    }, {
        'rank': 'ace',
        'value': 1
    }, {
        'rank': '2',
        'value': 2
    }, {
        'rank': '3',
        'value': 3
    }, {
        'rank': '4',
        'value': 4
    }, {
        'rank': '5',
        'value': 5
    }, {
        'rank': '6',
        'value': 6
    }, {
        'rank': '7',
        'value': 7
    }, {
        'rank': '8',
        'value': 8
    }, {
        'rank': '9',
        'value': 9
    }, {
        'rank': '10',
        'value': 10
    }, {
        'rank': 'jack',
        'value': 10
    }, {
        'rank': 'queen',
        'value': 10
    }, {
        'rank': 'king',
        'value': 10
    }]
    // create array to seat players correctly for each individual
    var sortedArray = new Array();
    // create array for players and their cards
    var initialPlayerCards = new Array();
    // array of my current cards
    var myCurrentCards = new Array();
    // array of cards to be swaped
    var swapArray = new Array();
    // revealed middle card
    var middleCard = '';

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
    // check if second card chosen to swap is the same rank as the first
    function checkRank(cardId, amountOfCards) {
        // first card rank
        var firstSelectionIndex = swapArray[0];
        var firstSelectionStr = myCurrentCards[firstSelectionIndex];
        var firstSelectionRank = firstSelectionStr.substr(0, firstSelectionStr.length - 2);
        if (amountOfCards == 1) {
            // second card rank
            cardToSwap(cardId);
            var secondSelectionIndex = swapArray[1];
            var secondSelectionStr = myCurrentCards[secondSelectionIndex];
            var secondSelectionRank = secondSelectionStr.substr(0, secondSelectionStr.length - 2);
            // the check
            if (firstSelectionRank == secondSelectionRank) {
                return true;
            } else {
                swapArray.pop();
            }
        } else if (amountOfCards == 2) {
            // second card rank
            cardToSwap(cardId);
            var thirdSelectionIndex = swapArray[2];
            var thirdSelectionStr = myCurrentCards[thirdSelectionIndex];
            var thirdSelectionRank = thirdSelectionStr.substr(0, thirdSelectionStr.length - 2);
            // the check
            if (firstSelectionRank == thirdSelectionRank) {
                return true;
            } else {
                swapArray.pop();
            }
        } else if (amountOfCards == 38) {
            // second card rank
            cardToSwap(cardId);
            var fourthSelectionIndex = swapArray[3];
            var fourthSelectionStr = myCurrentCards[fourthSelectionIndex];
            var fourthSelectionRank = fourthSelectionStr.substr(0, fourthSelectionStr.length - 2);
            // the check
            if (firstSelectionRank == fourthSelectionRank) {
                return true;
            } else {
                swapArray.pop();
            }
        }
    }
    // card listeners
    $('.game-card').each(function () {
        var thisCard = $(this)[0];
        thisCard.addEventListener('click', function () {
            if ($(this).hasClass('hover') && swapArray.length > 0) {
                if (checkRank(thisCard.id, swapArray.length)) {
                    thisCard.classList.add('selected');
                    thisCard.classList.remove('hover');
                }
            } else if ($(this).hasClass('hover')) {
                cardToSwap(thisCard.id);
                thisCard.classList.add('selected');
                thisCard.classList.remove('hover');
            } else if ($(this).hasClass('selected')) {
                swapArray.pop();
                thisCard.classList.remove('selected');
                thisCard.classList.add('hover');
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
    // display other player card number
    function updateOthersCardOnHand(whoSwapped, cardsLeftOnHand) {
        var who = findIndexByKeyValue(sortedArray, 'username', whoSwapped)

        if (who == 1) {
            playerTwo.innerHTML = '<p>' + sortedArray[1].username + '<br />' + cardsLeftOnHand + ' cards</p>'
        } else if (who == 2) {
            playerThree.innerHTML = '<p>' + sortedArray[2].username + '<br />' + cardsLeftOnHand + ' cards</p>'
        } else if (who == 3) {
            playerFour.innerHTML = '<p>' + sortedArray[3].username + '<br />' + cardsLeftOnHand + ' cards</p>'
        }
    }
    // update and display current players points on hand
    function myPointsOnHand(cardArray) {
        var myPoints = 0;
        for (var i = 0; i < cardArray.length; i++) {
            var theCardStr = cardArray[i];
            var theCardRank = theCardStr.substr(0, theCardStr.length - 2)
            var theCardValueIndex = findIndexByKeyValue(cardPointValues, 'rank', theCardRank);
            var theCardValue = cardPointValues[theCardValueIndex].value;
            myPoints += theCardValue;
        }
        playerOne.innerHTML = '<p>' + myPoints + '<br />points</p>'
    }
    // display players in their seats 
    function seatPlayers(playerArray) {
        if (playerArray.length == 1) {
            playerOneColumn.innerHTML = '<p><strong>' + playerArray[0].username + '</strong></p>'
        } else if (playerArray.length == 2) {
            playerOneColumn.innerHTML = '<p><strong>' + playerArray[0].username + '</strong></p>'
            playerTwo.innerHTML = '<p>' + playerArray[1].username + '<br />5 cards</p>'
            playerTwoColumn.innerHTML = '<p><strong>' + playerArray[1].username + '</strong></p>'
        } else if (playerArray.length == 3) {
            playerOneColumn.innerHTML = '<p><strong>' + playerArray[0].username + '</strong></p>'
            playerTwo.innerHTML = '<p>' + playerArray[1].username + '<br />5 cards</p>'
            playerTwoColumn.innerHTML = '<p><strong>' + playerArray[1].username + '</strong></p>'
            playerThree.innerHTML = '<p>' + playerArray[2].username + '<br />5 cards</p>'
            playerThreeColumn.innerHTML = '<p><strong>' + playerArray[2].username + '</strong></p>'
        } else if (playerArray.length == 4) {
            playerOneColumn.innerHTML = '<p><strong>' + playerArray[0].username + '</strong></p>'
            playerTwo.innerHTML = '<p>' + playerArray[1].username + '<br />5 cards</p>'
            playerTwoColumn.innerHTML = '<p><strong>' + playerArray[1].username + '</strong></p>'
            playerThree.innerHTML = '<p>' + playerArray[2].username + '<br />5 cards</p>'
            playerThreeColumn.innerHTML = '<p><strong>' + playerArray[2].username + '</strong></p>'
            playerFour.innerHTML = '<p>' + playerArray[3].username + '<br />5 cards</p>'
            playerFourColumn.innerHTML = '<p><strong>' + playerArray[3].username + '</strong></p>'
        }
    }
    // sort players array
    function sortPlayers(unsortedArray) {
        var playerIndex = findIndexByKeyValue(unsortedArray, 'username', player['username']);
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
    // unselect all cards after a swap has been made
    function unselectAllCards() {
        swapArray = [];
        $('.game-card').each(function () {
            var thisCard = $(this)[0];
            if ($(this).hasClass('selected')) {
                thisCard.classList.remove('selected');
                thisCard.classList.add('hover');
            }
        })
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
        middleCard = thisTable['cards'].pop();
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
    // hide start button and display middle cards 
    function hideStartDisplayDeck() {
        startGameBtn.classList.add('hidden');
        deckFront[0].classList.remove('hidden');
        deckBack.classList.remove('hidden');
    }
    // display updated middle card
    function displayMiddleCard() {
        deckFront.css('background-image', 'url("../assets/cards/' + middleCard + '.png")');
    }
    // display players cards on hand
    function displayCardsOnHand(cardArray) {
        if (cardArray.length == 1) {
            cardOne.css('background-image', 'url("../assets/cards/' + cardArray[0] + '.png")');
            cardTwo[0].classList.add('hidden');
            cardThree[0].classList.add('hidden');
            cardFour[0].classList.add('hidden');
            cardFive[0].classList.add('hidden');
        } else if (cardArray.length == 2) {
            cardOne.css('background-image', 'url("../assets/cards/' + cardArray[0] + '.png")');
            cardTwo.css('background-image', 'url("../assets/cards/' + cardArray[1] + '.png")');
            cardThree[0].classList.add('hidden');
            cardFour[0].classList.add('hidden');
            cardFive[0].classList.add('hidden');
        } else if (cardArray.length == 3) {
            cardOne.css('background-image', 'url("../assets/cards/' + cardArray[0] + '.png")');
            cardTwo.css('background-image', 'url("../assets/cards/' + cardArray[1] + '.png")');
            cardThree.css('background-image', 'url("../assets/cards/' + cardArray[2] + '.png")');
            cardFour[0].classList.add('hidden');
            cardFive[0].classList.add('hidden');
        } else if (cardArray.length == 4) {
            cardOne.css('background-image', 'url("../assets/cards/' + cardArray[0] + '.png")');
            cardTwo.css('background-image', 'url("../assets/cards/' + cardArray[1] + '.png")');
            cardThree.css('background-image', 'url("../assets/cards/' + cardArray[2] + '.png")');
            cardFour.css('background-image', 'url("../assets/cards/' + cardArray[3] + '.png")');
            cardFive[0].classList.add('hidden');
        } else if (cardArray.length == 5) {
            cardOne.css('background-image', 'url("../assets/cards/' + cardArray[0] + '.png")');
            cardTwo.css('background-image', 'url("../assets/cards/' + cardArray[1] + '.png")');
            cardThree.css('background-image', 'url("../assets/cards/' + cardArray[2] + '.png")');
            cardFour.css('background-image', 'url("../assets/cards/' + cardArray[3] + '.png")');
            cardFive.css('background-image', 'url("../assets/cards/' + cardArray[4] + '.png")');
        }
    }
    // get rid of any extra cards if selected 
    function discardExtraCards() {
        // sort arrray in a descending order
        var sortedSwapArray = swapArray.sort(function (a, b) {
            return b - a
        });

        if (sortedSwapArray.length == 1) {
            myCurrentCards.splice(sortedSwapArray[0], 1);
        } else if (sortedSwapArray.length == 2) {
            myCurrentCards.splice(sortedSwapArray[0], 1);
            myCurrentCards.splice(sortedSwapArray[1], 1);
        } else if (sortedSwapArray.length == 3) {
            myCurrentCards.splice(sortedSwapArray[0], 1);
            myCurrentCards.splice(sortedSwapArray[1], 1);
            myCurrentCards.splice(sortedSwapArray[2], 1);
        }
    }
    // pick up a random card from the deck
    function pickUpRandomCard() {
        if (swapArray.length > 0) {
            var randomCard = thisTable['cards'].pop();
            var selectedCardIndex = swapArray[0];
            swapArray.splice(0, 1);
            var middleCardArray = myCurrentCards.splice(selectedCardIndex, 1, randomCard);
            middleCard = middleCardArray[0];
            if (swapArray.length > 0) {
                discardExtraCards();
            }
            displayCardsOnHand(myCurrentCards);
            myPointsOnHand(myCurrentCards);
            deckFront.css('background-image', 'url("../assets/cards/' + middleCard + '.png")');
        }

    }
    // pick up the revealed card from middle
    function pickUpMiddleCard() {
        if (swapArray.length > 0) {
            var selectedCardIndex = swapArray[0];
            swapArray.splice(0, 1);
            var selectedCard = myCurrentCards.splice(selectedCardIndex, 1, middleCard);
            middleCard = selectedCard[0];
            if (swapArray.length > 0) {
                discardExtraCards();
            }
            displayCardsOnHand(myCurrentCards);
            myPointsOnHand(myCurrentCards);
            deckFront.css('background-image', 'url("../assets/cards/' + middleCard + '.png")');
        }
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
            cards: initialPlayerCards,
            middleCard: middleCard
        });
    })
    // add event listener for when someone wants to pick up a random card from the deck
    deckBack.addEventListener('click', function () {
        pickUpRandomCard();
        unselectAllCards();
        socket.emit('card-swapped', {
            deck: thisTable['cards'],
            middleCard: middleCard,
            whoSwapped: player['username'],
            cardsLeftOnHand: myCurrentCards.length
        });
    })
    // add event listener for when someone wants to pick the revealed middle card
    deckFront[0].addEventListener('click', function () {
        pickUpMiddleCard();
        unselectAllCards();
        socket.emit('card-swapped', {
            deck: thisTable['cards'],
            middleCard: middleCard,
            whoSwapped: player['username'],
            cardsLeftOnHand: myCurrentCards.length
        });
    })
    // add event listener for when someone starts typing
    gameMessageField.addEventListener('keypress', function () {
        socket.emit('player-typing', player['username']);
    })
    // synchronize every deck so it has the same card in the pile as well as make sure each person has unique cards
    socket.on('shuffled-deck', function (data) {
        thisTable['cards'] = data.deck;
        middleCard = data.middleCard;
        for (var i = 0; i < data.cards.length; i++) {
            if (player['username'] == data.cards[i].username) {
                myCurrentCards = data.cards[i].cardsOnHand;
            }
        }
        displayCardsOnHand(myCurrentCards);
        hideStartDisplayDeck();
        displayMiddleCard();
        myPointsOnHand(myCurrentCards);
    })
    // update the game middle card and the deck so it is in sync with the rest of the players
    socket.on('card-swapped', function (data) {
        thisTable['cards'] = data.deck;
        middleCard = data.middleCard;
        displayMiddleCard();
        updateOthersCardOnHand(data.whoSwapped, data.cardsLeftOnHand);
    })
    // update the game chat window with the most recent messages
    socket.on('game-chat', function (data) {
        gameTypingDetector.innerHTML = '';
        gameChatOutput.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
    })
    // update the chat window to inform the other players if someone starts typing
    socket.on('player-typing', function (data) {
        gameTypingDetector.innerHTML = '<p><em>' + data + ' is typing...</em></p>';
    })
});