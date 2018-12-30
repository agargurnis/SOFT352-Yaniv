$(document).ready(function () {
    // make connection
    var socket = io.connect('http://localhost:4000');
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
    var playerWhoWon = $('#who-won')[0];
    // query dom for buttons
    var gameSendBtn = $('#game-send-btn')[0];
    var startGameBtn = $('#start-game-btn')[0];
    var leaveBtn = $('#leave-game')[0];
    var gameOverBtn = $('#leave-game-over')[0];
    var callYanivBtn = $('#call-yaniv')[0];
    var nextRoundBtn = $('#next-round')[0];
    // query dom for player point columns
    var playerOneColumn = $('#player-one-column')[0];
    var playerTwoColumn = $('#player-two-column')[0];
    var playerThreeColumn = $('#player-three-column')[0];
    var playerFourColumn = $('#player-four-column')[0];
    // query dom cards
    var deckFront = $('#deck-front');
    var deckBack = $('#deck-back')[0];
    // retrieve player object from local storage
    var urlString = window.location.href;
    var url = new URL(urlString);
    var playerKey = url.searchParams.get('name');
    var tableKey = url.searchParams.get('table');
    var player = JSON.parse(localStorage.getItem(playerKey));
    var thisTable = JSON.parse(localStorage.getItem(tableKey));
    var fullDeckOfCards = ['2-D', '2-C', '2-H', '3-S', '3-D', '3-C', '3-H', '3-S', '4-D', '4-C', '4-H', '4-S', '5-D', '5-C', '5-H', '5-S', '6-D', '6-C', '6-H', '6-S', '7-D', '7-C', '7-H', '7-S', '8-D', '8-C', '8-H', '8-S', '9-D', '9-C', '9-H', '9-S', '10-D', '10-C', '10-H', '10-S', 'jack-D', 'jack-C', 'jack-H', 'jack-S', 'queen-D', 'queen-C', 'queen-H', 'queen-S', 'king-D', 'king-C', 'king-H', 'king-S', 'ace-D', 'ace-C', 'ace-H', 'ace-S', 'joker-R', 'joker-B'];
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
    var sortedArray = [{}, {}, {}, {}];
    // create array for players and their cards
    var initialPlayerCards = new Array();
    // array of my current cards
    var myCurrentCards = new Array();
    // array of cards to be swaped
    var swapArray = new Array();
    // array of players who did not win
    var loserArray = new Array();
    // revealed middle card
    var middleCard = '';
    // next player username
    var nextPlayer = '';
    // variable that contains how many points the user has currently on hand
    var myPoints = 0;
    // variable that show if it is this players turn or not
    var myTurn = false;
    // variable to know when to update the score board
    var updateCounter = 0;
    // function to find index by key value pairs
    function findIndexByKeyValue(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] == value) {
                return i;
            }
        }
        return -1;
    }
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
        } else if (amountOfCards == 3) {
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
    function addCardListener() {
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
    }
    // remove card listener
    function removeCardListener() {
        $('.game-card').each(function () {
            var thisCard = $(this);
            thisCard.replaceWith(thisCard.clone());
        })
    }
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
        myPoints = 0;
        for (var i = 0; i < cardArray.length; i++) {
            var theCardStr = cardArray[i];
            var theCardRank = theCardStr.substr(0, theCardStr.length - 2)
            var theCardValueIndex = findIndexByKeyValue(cardPointValues, 'rank', theCardRank);
            var theCardValue = cardPointValues[theCardValueIndex].value;
            myPoints += theCardValue;
        }
        playerOne.innerHTML = '<p>' + myPoints + '<br />points</p>'
    }
    // display points on the score board
    function displayScoreBoardPoints(playerArray) {
        playerOneColumn.innerHTML += playerArray[0].totalPoints == null ? '' : '<p><strong>' + playerArray[0].totalPoints + '</strong></p>'
        playerTwoColumn.innerHTML += playerArray[1].totalPoints == null ? '' : '<p><strong>' + playerArray[1].totalPoints + '</strong></p>'
        playerThreeColumn.innerHTML += playerArray[2].totalPoints == null ? '' : '<p><strong>' + playerArray[2].totalPoints + '</strong></p>'
        playerFourColumn.innerHTML += playerArray[3].totalPoints == null ? '' : '<p><strong>' + playerArray[3].totalPoints + '</strong></p>'
    }
    // display players in their seats 
    function seatPlayers(playerArray) {
        playerOneColumn.innerHTML = playerArray[0].username == null ? '' : '<p><strong>' + playerArray[0].username + '</strong></p>'
        playerTwo.innerHTML = playerArray[1].username == null ? '' : '<p>' + playerArray[1].username + '<br />5 cards</p>'
        playerTwoColumn.innerHTML = playerArray[1].username == null ? '' : '<p><strong>' + playerArray[1].username + '</strong></p>'
        playerThree.innerHTML = playerArray[2].username == null ? '' : '<p>' + playerArray[2].username + '<br />5 cards</p>'
        playerThreeColumn.innerHTML = playerArray[2].username == null ? '' : '<p><strong>' + playerArray[2].username + '</strong></p>'
        playerFour.innerHTML = playerArray[3].username == null ? '' : '<p>' + playerArray[3].username + '<br />5 cards</p>'
        playerFourColumn.innerHTML = playerArray[3].username == null ? '' : '<p><strong>' + playerArray[3].username + '</strong></p>'
    }
    // check if its my turn and if so enable card selection
    function checkIfMyTurn() {
        for (var i = 0; i < sortedArray.length; i++) {
            if (sortedArray[i].myTurn == true && sortedArray[i].username == player['username']) {
                addCardListener();
                myTurn = true;
            }
        }
    }
    // display whos turn is it
    function displayWhosTurn() {
        $('.player').each(function () {
            var thisPlayer = $(this)[0];
            thisPlayer.classList.remove('my-turn');
        })

        for (var i = 0; i < sortedArray.length; i++) {
            if (sortedArray[i].myTurn == true) {
                if (i == 0) {
                    playerOne.classList.add('my-turn')
                } else if (i == 1) {
                    playerTwo.classList.add('my-turn')
                } else if (i == 2) {
                    playerThree.classList.add('my-turn')
                } else if (i == 3) {
                    playerFour.classList.add('my-turn')
                }
            }
        }
    }
    // check who is next 
    function checkWhoIsNext(currentPlayer, unsortedPlayerArray) {
        var currentPlayerIndex = findIndexByKeyValue(unsortedPlayerArray, 'username', currentPlayer);
        if (unsortedPlayerArray.length == 2) {
            if (currentPlayerIndex == 0) {
                return unsortedPlayerArray[1].username
            } else if (currentPlayerIndex == 1) {
                return unsortedPlayerArray[0].username
            }
        } else if (unsortedPlayerArray.length == 3) {
            if (currentPlayerIndex == 0) {
                return unsortedPlayerArray[1].username
            } else if (currentPlayerIndex == 1) {
                return unsortedPlayerArray[2].username
            } else if (currentPlayerIndex == 2) {
                return unsortedPlayerArray[0].username
            }
        } else if (unsortedPlayerArray.length == 4) {
            if (currentPlayerIndex == 0) {
                return unsortedPlayerArray[1].username
            } else if (currentPlayerIndex == 1) {
                return unsortedPlayerArray[2].username
            } else if (currentPlayerIndex == 2) {
                return unsortedPlayerArray[3].username
            } else if (currentPlayerIndex == 3) {
                return unsortedPlayerArray[0].username
            }
        }
    }
    // finish your turn
    function finishMyTurn(currentPlayer) {
        myTurn = false;
        checkWin();
        var nextPlayerName = checkWhoIsNext(currentPlayer, thisTable['players']);
        var nextPlayerIndex = findIndexByKeyValue(sortedArray, 'username', nextPlayerName);
        nextPlayer = sortedArray[nextPlayerIndex].username;
        startNextTurn(currentPlayer, nextPlayer);
    }
    // start next players turn
    function startNextTurn(previousPlayerUsername, nextPlayerUsername) {
        var nextPlayersIndex = findIndexByKeyValue(sortedArray, 'username', nextPlayerUsername);
        var previousPlayersIndex = findIndexByKeyValue(sortedArray, 'username', previousPlayerUsername);
        sortedArray[previousPlayersIndex].myTurn = false;
        sortedArray[nextPlayersIndex].myTurn = true;
        checkIfMyTurn();
        displayWhosTurn();
    }
    // sort players array
    function sortPlayers(unsortedArray) {
        unsortedArray[0].myTurn = true;
        var playerIndex = findIndexByKeyValue(unsortedArray, 'username', player['username']);
        if (unsortedArray.length == 1) {
            sortedArray[0] = unsortedArray[0];
            startGameBtn.classList.remove('hidden');
        } else if (unsortedArray.length == 2) {
            if (playerIndex == 0) {
                sortedArray[0] = unsortedArray[0];
                sortedArray[1] = unsortedArray[1];
                sortedArray[2] = {};
                sortedArray[3] = {};
            } else if (playerIndex == 1) {
                sortedArray[0] = unsortedArray[1];
                sortedArray[3] = unsortedArray[0];
                sortedArray[1] = {};
                sortedArray[2] = {};
            }
        } else if (unsortedArray.length == 3) {
            if (playerIndex == 0) {
                sortedArray[0] = unsortedArray[0];
                sortedArray[1] = unsortedArray[1];
                sortedArray[2] = unsortedArray[2];
                sortedArray[3] = {};
            } else if (playerIndex == 1) {
                sortedArray[0] = unsortedArray[1];
                sortedArray[3] = unsortedArray[0];
                sortedArray[1] = unsortedArray[2];
                sortedArray[2] = {};
            } else if (playerIndex == 2) {
                sortedArray[0] = unsortedArray[2];
                sortedArray[3] = unsortedArray[1];
                sortedArray[2] = unsortedArray[0];
                sortedArray[1] = {};
            }
        } else if (unsortedArray.length == 4) {
            if (playerIndex == 1) {
                sortedArray[0] = unsortedArray[1];
                sortedArray[1] = unsortedArray[2];
                sortedArray[2] = unsortedArray[3];
                sortedArray[3] = unsortedArray[0];

            } else if (playerIndex == 2) {
                sortedArray[0] = unsortedArray[2];
                sortedArray[1] = unsortedArray[3];
                sortedArray[2] = unsortedArray[0];
                sortedArray[3] = unsortedArray[1];
            } else if (playerIndex == 3) {
                sortedArray[0] = unsortedArray[3];
                sortedArray[1] = unsortedArray[0];
                sortedArray[2] = unsortedArray[1];
                sortedArray[3] = unsortedArray[2];
            } else {
                sortedArray = unsortedArray
            }
        }
        seatPlayers(sortedArray);
        displayWhosTurn();
    }
    // unselect all cards after a swap has been made
    function unselectAllCards() {
        swapArray = new Array();
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
            unsortedPlayerArray[i].cardsOnHand = new Array();
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
    function displayDeck() {
        deckFront[0].classList.remove('hidden');
        deckBack.classList.remove('hidden');
    }
    // display updated middle card
    function displayMiddleCard() {
        deckFront.css('background-image', 'url("../assets/cards/' + middleCard + '.png")');
    }
    // unhide all cards on a new round
    function resetTable() {
        $('#card-one')[0].classList.remove('hidden');
        $('#card-one').css('background-image', 'url("../assets/cards/deck.png")');
        $('#card-two')[0].classList.remove('hidden');
        $('#card-two').css('background-image', 'url("../assets/cards/deck.png")');
        $('#card-three')[0].classList.remove('hidden');
        $('#card-three').css('background-image', 'url("../assets/cards/deck.png")');
        $('#card-four')[0].classList.remove('hidden');
        $('#card-four').css('background-image', 'url("../assets/cards/deck.png")');
        $('#card-five')[0].classList.remove('hidden');
        $('#card-five').css('background-image', 'url("../assets/cards/deck.png")');
        $('#deck-front').css('background-image', 'url("../assets/cards/deck.png")');
        playerTwo.innerHTML = sortedArray[1].username == null ? '' : '<p>' + sortedArray[1].username + '<br />5 cards</p>'
        playerThree.innerHTML = sortedArray[2].username == null ? '' : '<p>' + sortedArray[2].username + '<br />5 cards</p>'
        playerFour.innerHTML = sortedArray[3].username == null ? '' : '<p>' + sortedArray[3].username + '<br />5 cards</p>'
        callYanivBtn.classList.add('hidden');
    }
    // display players cards on hand
    function displayCardsOnHand(cardArray) {
        if (cardArray.length == 1) {
            $('#card-one').css('background-image', 'url("../assets/cards/' + cardArray[0] + '.png")');
            $('#card-two')[0].classList.add('hidden');
            $('#card-three')[0].classList.add('hidden');
            $('#card-four')[0].classList.add('hidden');
            $('#card-five')[0].classList.add('hidden');
        } else if (cardArray.length == 2) {
            $('#card-one').css('background-image', 'url("../assets/cards/' + cardArray[0] + '.png")');
            $('#card-two').css('background-image', 'url("../assets/cards/' + cardArray[1] + '.png")');
            $('#card-three')[0].classList.add('hidden');
            $('#card-four')[0].classList.add('hidden');
            $('#card-five')[0].classList.add('hidden');
        } else if (cardArray.length == 3) {
            $('#card-one').css('background-image', 'url("../assets/cards/' + cardArray[0] + '.png")');
            $('#card-two').css('background-image', 'url("../assets/cards/' + cardArray[1] + '.png")');
            $('#card-three').css('background-image', 'url("../assets/cards/' + cardArray[2] + '.png")');
            $('#card-four')[0].classList.add('hidden');
            $('#card-five')[0].classList.add('hidden');
        } else if (cardArray.length == 4) {
            $('#card-one').css('background-image', 'url("../assets/cards/' + cardArray[0] + '.png")');
            $('#card-two').css('background-image', 'url("../assets/cards/' + cardArray[1] + '.png")');
            $('#card-three').css('background-image', 'url("../assets/cards/' + cardArray[2] + '.png")');
            $('#card-four').css('background-image', 'url("../assets/cards/' + cardArray[3] + '.png")');
            $('#card-five')[0].classList.add('hidden');
        } else if (cardArray.length == 5) {
            $('#card-one').css('background-image', 'url("../assets/cards/' + cardArray[0] + '.png")');
            $('#card-two').css('background-image', 'url("../assets/cards/' + cardArray[1] + '.png")');
            $('#card-three').css('background-image', 'url("../assets/cards/' + cardArray[2] + '.png")');
            $('#card-four').css('background-image', 'url("../assets/cards/' + cardArray[3] + '.png")');
            $('#card-five').css('background-image', 'url("../assets/cards/' + cardArray[4] + '.png")');
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
        // check if there is any cards left on the table
        if (thisTable['cards'].length == 0) {
            // if not then place a new shuffled deck on the table
            thisTable['cards'] = Array.from(fullDeckOfCards);
            shuffleCards(thisTable['cards']);
            // and continue as usual
        }
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
    // pick up the revealed card from middle
    function pickUpMiddleCard() {
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
    // update database when someone leaves the table
    function leaveTable() {
        var tableData = {
            "tableName": tableKey,
            "username": player['username']
        }
        axios
            .post('/api/game/leave', tableData)
            .then(response => {
                socket.emit('leave-table', tableKey);
                socket.emit('player-left', {
                    table: tableKey,
                    player: player
                })
                localStorage.removeItem(tableKey);
                window.location.href = "http://localhost:4000/lobby?name=" + player.username;
            })
            .catch(error =>
                console.log(error)
            );
    }
    // update database when the game is started
    function startGame() {
        var tableData = {
            "tableName": tableKey
        }
        axios
            .post('/api/game/start', tableData)
            .then(response => {
                socket.emit('game-started', tableKey);
            })
            .catch(error =>
                console.log(error)
            );
    }
    // do the initial setup for the game
    function setupTable() {
        sortPlayers(thisTable['players']);
    }
    // check if a player has less than 5 points so he can call Yaniv
    function checkWin() {
        if (myPoints <= 10) {
            callYanivBtn.classList.remove('hidden');
        } else {
            callYanivBtn.classList.add('hidden');
        }
    }
    // shuffle and deal cards
    function dealNewCards() {
        thisTable['cards'] = Array.from(fullDeckOfCards);
        shuffleCards(thisTable['cards']);
        dealCards(thisTable['players']);
        socket.emit('shuffled-deck', {
            deck: thisTable['cards'],
            cards: initialPlayerCards,
            middleCard: middleCard
        });
    }
    // a function that send every players score to every player so it then can be compared and displayed
    function revealPoints() {
        socket.emit('add-points-to-array', {
            table: tableKey,
            username: player['username'],
            pointsOnHand: myPoints
        })
    }
    // the function that compares every players score and checks if any other player had a lower score and if so the player who called yaniv gets a penalty
    function comparePoints(sortedArray) {
        var compareArray = Array.from(sortedArray);
        // sort arrray in a ascending order
        var sortedCompareArray = compareArray.sort(function (a, b) {
            return a.pointsOnHand - b.pointsOnHand
        });
        if (sortedCompareArray[0].myTurn == true && sortedCompareArray[0].pointsOnHand == sortedCompareArray[1].pointsOnHand) {
            sortedCompareArray[0].totalPoints += 30;
            calculateScoreBoardPoints(sortedCompareArray[0]);
        } else if (sortedCompareArray[0].myTurn == true) {
            compareArray[0].totalPoints -= compareArray[0].pointsOnHand;
            calculateScoreBoardPoints(sortedCompareArray[0]);
        } else if (sortedCompareArray[1].myTurn == true) {
            sortedCompareArray[1].totalPoints += 30;
            calculateScoreBoardPoints(sortedCompareArray[1]);
        } else if (sortedCompareArray[2].myTurn == true) {
            sortedCompareArray[2].totalPoints += 30;
            calculateScoreBoardPoints(sortedCompareArray[2]);
        } else if (sortedCompareArray[3].myTurn == true) {
            sortedCompareArray[3].totalPoints += 30;
            calculateScoreBoardPoints(sortedCompareArray[3]);
        }
    }
    // updates the player array if anyone gets a penalty or not
    function calculateScoreBoardPoints(player) {
        var indexToUpdate = findIndexByKeyValue(sortedArray, 'username', player.username);
        sortedArray[indexToUpdate].totalPoints = player.totalPoints;
        checkEndGame(sortedArray);
        displayScoreBoardPoints(sortedArray);
    }
    // check if any of the players have a score over 200 and announce a winner if there is only one left with less than 200 points
    function checkEndGame(playerArray) {
        for (var i = 0; i < playerArray.length; i++) {
            if (playerArray[i].totalPoints >= 100 && loserArray.length == 0) {
                loserArray.push(playerArray[i]);
            } else if (playerArray[i].totalPoints >= 100 && loserArray.some(player => player.username == playerArray[i].username) == false) {
                loserArray.push(playerArray[i]);
            }
        }
        if (loserArray.length >= 3) {
            var winningArray = Array.from(playerArray);
            // sort arrray in a ascending order
            var sortedWinningArray = winningArray.sort(function (a, b) {
                return a.totalPoints - b.totalPoints
            });
            // hide the table and cards and display who won as well as a button to leave the game
            $('#the-round-table')[0].classList.add('hidden');
            $('#player-cards')[0].classList.add('hidden');
            $('#game-over-box')[0].classList.remove('hidden');
            playerWhoWon.innerHTML = '<p><strong>' + sortedWinningArray[0].username + '</strong><br/> won the game <br/> thank you for playing </p>'
        }
    }
    // add event listner for the game over button
    gameOverBtn.addEventListener('click', function () {
        leaveTable();
    })
    // call yaniv to indicate that you think you might have won
    callYanivBtn.addEventListener('click', function () {
        if (myTurn == true) {
            // myPoints = 0;
            socket.emit('reveal-points', tableKey);
            callYanivBtn.classList.add('hidden');
            nextRoundBtn.classList.remove('hidden');
        }
    })
    // send to everyone the same shuffled deck of cards
    nextRoundBtn.addEventListener('click', function () {
        dealNewCards();
        nextRoundBtn.classList.add('hidden');
    })
    // send to everyone the same shuffled deck of cards
    startGameBtn.addEventListener('click', function () {
        startGame();
        dealNewCards();
        addCardListener();
        startGameBtn.classList.add('hidden');
    })
    // add event listener for when someone wants to pick up a random card from the deck
    deckBack.addEventListener('click', function () {
        if (swapArray.length > 0) {
            pickUpRandomCard();
            unselectAllCards();
            removeCardListener();
            finishMyTurn(player['username']);
            socket.emit('card-swapped', {
                deck: thisTable['cards'],
                middleCard: middleCard,
                whoSwapped: player['username'],
                cardsLeftOnHand: myCurrentCards.length,
                nextPlayer: nextPlayer
            });
        }

    })
    // add event listener for when someone wants to pick the revealed middle card
    deckFront[0].addEventListener('click', function () {
        if (swapArray.length > 0) {
            pickUpMiddleCard();
            unselectAllCards();
            removeCardListener();
            finishMyTurn(player['username']);
            socket.emit('card-swapped', {
                deck: thisTable['cards'],
                middleCard: middleCard,
                whoSwapped: player['username'],
                cardsLeftOnHand: myCurrentCards.length,
                nextPlayer: nextPlayer
            });
        }
    })
    // click the send button on the press of the enter key in message input field
    gameMessageField.addEventListener("keyup", function (e) {
        e.preventDefault();
        // Number 13 is the "Enter" key on the keyboard
        if (e.keyCode === 13) {
            gameSendBtn.click();
        }
    });
    // add event listener for when someone starts typing
    gameMessageField.addEventListener('keypress', function () {
        socket.emit('player-typing', player['username']);
    })
    // game container listeners
    gameSendBtn.addEventListener('click', function () {
        if (gameMessageField.value !== '') {
            socket.emit('game-chat', {
                message: gameMessageField.value,
                handle: player['username']
            });
        }
        gameMessageField.value = '';
    })
    // add event listner for button
    leaveBtn.addEventListener('click', function () {
        leaveTable();
    })
    // synchronize every deck so it has the same card in the pile as well as make sure each person has unique cards
    socket.on('shuffled-deck', function (data) {
        myCurrentCards = new Array();
        thisTable['cards'] = data.deck;
        middleCard = data.middleCard;
        for (var i = 0; i < data.cards.length; i++) {
            if (player['username'] == data.cards[i].username) {
                myCurrentCards = data.cards[i].cardsOnHand;
            }
        }
        displayCardsOnHand(myCurrentCards);
        displayDeck();
        displayMiddleCard();
        myPointsOnHand(myCurrentCards);
    })
    // update the game middle card and the deck so it is in sync with the rest of the players
    socket.on('card-swapped', function (data) {
        thisTable['cards'] = data.deck;
        middleCard = data.middleCard;
        displayMiddleCard();
        updateOthersCardOnHand(data.whoSwapped, data.cardsLeftOnHand);
        startNextTurn(data.whoSwapped, data.nextPlayer);
    })
    // request everyone to reveal points and add to score board
    socket.on('reveal-points', function () {
        revealPoints();
    })
    socket.on('add-points-to-array', function (data) {
        var indexToUpdate = findIndexByKeyValue(sortedArray, 'username', data.username);
        sortedArray[indexToUpdate].pointsOnHand = data.pointsOnHand;
        sortedArray[indexToUpdate].totalPoints += data.pointsOnHand;
        updateCounter++;

        if (thisTable['players'].length == 2 && updateCounter == 2) {
            displayScoreBoardPoints(sortedArray);
            resetTable();
            updateCounter = 0;
        }
        if (thisTable['players'].length == 3 && updateCounter == 3) {
            displayScoreBoardPoints(sortedArray);
            resetTable();
            updateCounter = 0;
        }
        if (thisTable['players'].length == 4 && updateCounter == 4) {
            comparePoints(sortedArray);
            resetTable();
            updateCounter = 0;
        }
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
    // add the new player on the array if he does not alreadt exist on it
    socket.on('player-joined', function (data) {
        var thisTablePlayers = thisTable['players'];
        for (var i = 0; i < thisTablePlayers.length; i++) {
            // check if user already exists on table then do nothing
            if (thisTablePlayers[i].username == data.username) {
                return;
            }
        }
        // else add the new player
        thisTable['players'].push(data)
        localStorage.setItem(tableKey, JSON.stringify(thisTable));
        sortPlayers(thisTable['players']);
    })
    // remove player from each player array
    socket.on('player-left', function (data) {
        var playerWhoLeftIndex = findIndexByKeyValue(thisTable['players'], 'username', data.username);
        thisTable['players'].splice(playerWhoLeftIndex, 1);
        localStorage.setItem(tableKey, JSON.stringify(thisTable));
        sortPlayers(thisTable['players']);
    })
    // inform players on the table that there a new player has joined
    socket.on('connect', function () {
        socket.emit('join-table', tableKey);
        socket.emit('player-joined', {
            table: tableKey,
            player: player
        })
    })
    window.onload = setupTable();
});