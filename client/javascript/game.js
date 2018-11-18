$(document).ready(function () {
    // make connection
    var socket = io.connect('http://localhost:4000');
    // query dom buttons
    var gameSendBtn = $('#game-send-btn')[0];
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
    var cardOne = $('#card-one')[0];
    var cardTwo = $('#card-two')[0];
    var cardThree = $('#card-three')[0];
    var cardFour = $('#card-four')[0];
    var cardFive = $('#card-five')[0];
    var deckFront = $('#deck-front')[0];
    var deckBack = $('#deck-back')[0];
    // retrieve player object from local storage
    var urlString = window.location.href;
    var url = new URL(urlString);
    var playerKey = url.searchParams.get("name");
    var tableKey = url.searchParams.get("table");
    var player = JSON.parse(localStorage.getItem(playerKey));
    var thisTable = JSON.parse(localStorage.getItem(tableKey));

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
            handle: player["username"]
        });
    })

    // card listeners
    $('.game-card').each(function () {
        var thisCard = $(this)[0];
        thisCard.addEventListener('click', function () {
            if ($(this).hasClass('hover')) {
                thisCard.classList.add('selected');
                thisCard.classList.remove('hover');
            } else if ($(this).hasClass('selected')) {
                thisCard.classList.remove('selected');
                thisCard.classList.add('hover');
            }
        })
    })
    // display players in their seats 
    function seatPlayers(playerArray) {
        console.log(playerArray);

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
        // thisTable['players'] = sortedArray;
        // localStorage.setItem(tableKey, JSON.stringify(thisTable));
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
    // shuffled deck of cards
    deckBack.addEventListener('click', function () {

        shuffleCards(thisTable['cards']);
        socket.emit('shuffled-deck', {
            deck: thisTable['cards']
        });
    })
    // hand out cards 
    function dealCards() {

    }
    // do the initial setup for the game
    function setupTable() {
        // shuffleCards(thisTable['cards']);
        sortPlayers(thisTable['players']);
        // console.log(thisTable['cards']);
    }

    window.onload = setupTable();

    gameMessageField.addEventListener('keypress', function () {
        socket.emit('player-typing', player["username"]);
    })

    socket.on('shuffled-deck', function (data) {
        thisTable['cards'] = data.deck;
        console.log(thisTable['cards']);
    })

    socket.on('game-chat', function (data) {
        gameTypingDetector.innerHTML = '';
        gameChatOutput.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
    })

    socket.on('player-typing', function (data) {
        gameTypingDetector.innerHTML = '<p><em>' + data + ' is typing...</em></p>';
    })
});