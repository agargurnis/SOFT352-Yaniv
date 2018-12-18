// setup all the necesary variables
const table = {
    cards: ['2-D', '2-C', '2-H', '3-S', '3-D', '3-C', '3-H', '3-S', '4-D', '4-C', '4-H', '4-S', '5-D', '5-C', '5-H', '5-S', '6-D', '6-C', '6-H', '6-S', '7-D', '7-C', '7-H', '7-S', '8-D', '8-C', '8-H', '8-S', '9-D', '9-C', '9-H', '9-S', '10-D', '10-C', '10-H', '10-S', 'jack-D', 'jack-C', 'jack-H', 'jack-S', 'queen-D', 'queen-C', 'queen-H', 'queen-S', 'king-D', 'king-C', 'king-H', 'king-S', 'ace-D', 'ace-C', 'ace-H', 'ace-S', 'joker-R', 'joker-B'],
    players: new Array()
}
const player1 = {
    username: "test1",
    cardsOnHand: new Array(),
    myTurn: false,
    pointsOnHand: 0,
    totalPoints: 0
}
table.players.push(player1);
const player2 = {
    username: "test2",
    cardsOnHand: new Array(),
    myTurn: false,
    pointsOnHand: 0,
    totalPoints: 0
}
table.players.push(player2);
const player3 = {
    username: "test3",
    cardsOnHand: new Array(),
    myTurn: true,
    pointsOnHand: 0,
    totalPoints: 0
}
table.players.push(player3);
const player4 = {
    username: "test4",
    cardsOnHand: new Array(),
    myTurn: false,
    pointsOnHand: 0,
    totalPoints: 0
}
table.players.push(player4);

// query dom for buttons
var gameSendBtn = $('#game-send-btn')[0];
var startGameBtn = $('#start-game-btn')[0];
var leaveBtn = $('#leave-game')[0];
var gameOverBtn = $('#leave-game-over')[0];
var callYanivBtn = $('#call-yaniv')[0];
var nextRoundBtn = $('#next-round')[0];

// query dom cards
var deckFront = $('#deck-front');
var deckBack = $('#deck-back')[0];

function findIndexByKeyValue(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] == value) {
            return i;
        }
    }
    return -1;
}

QUnit.test("seat players accordingly around the table", function (assert) {
    // setup the function to test
    function seatPlayers(playerArray) {
        $('#player-one-column')[0].innerHTML = playerArray[0].username == null ? '' : '<p><strong>' + playerArray[0].username + '</strong></p>'
        $('#player-two').innerHTML = playerArray[1].username == null ? '' : '<p>' + playerArray[1].username + '<br />5 cards</p>'
        $('#player-two-column')[0].innerHTML = playerArray[1].username == null ? '' : '<p><strong>' + playerArray[1].username + '</strong></p>'
        $('#player-three').innerHTML = playerArray[2].username == null ? '' : '<p>' + playerArray[2].username + '<br />5 cards</p>'
        $('#player-three-column')[0].innerHTML = playerArray[2].username == null ? '' : '<p><strong>' + playerArray[2].username + '</strong></p>'
        $('#player-four').innerHTML = playerArray[3].username == null ? '' : '<p>' + playerArray[3].username + '<br />5 cards</p>'
        $('#player-four-column')[0].innerHTML = playerArray[3].username == null ? '' : '<p><strong>' + playerArray[3].username + '</strong></p>'
    }

    seatPlayers(table.players);

    assert.equal($('#player-one-column')[0].innerHTML, "<p><strong>test1</strong></p>", "player 1 is in the right place");
    assert.equal($('#player-two-column')[0].innerHTML, "<p><strong>test2</strong></p>", "player 2 is in the right place");
    assert.equal($('#player-three-column')[0].innerHTML, "<p><strong>test3</strong></p>", "player 3 is in the right place");
    assert.equal($('#player-four-column')[0].innerHTML, "<p><strong>test4</strong></p>", "player 4 is in the right place");
})

QUnit.test("display who's turn is it", function (assert) {
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
        var nextPlayerName = checkWhoIsNext(currentPlayer, table.players);
        var nextPlayerIndex = findIndexByKeyValue(table.players, 'username', nextPlayerName);
        nextPlayer = table.players[nextPlayerIndex].username;
        startNextTurn(currentPlayer, nextPlayer);
    }
    // start next players turn
    function startNextTurn(previousPlayerUsername, nextPlayerUsername) {
        var nextPlayersIndex = findIndexByKeyValue(table.players, 'username', nextPlayerUsername);
        var previousPlayersIndex = findIndexByKeyValue(table.players, 'username', previousPlayerUsername);
        table.players[previousPlayersIndex].myTurn = false;
        table.players[nextPlayersIndex].myTurn = true;
        displayWhosTurn();
    }
    // setup function to test
    function displayWhosTurn() {
        $('.player').each(function () {
            var thisPlayer = $(this)[0];
            thisPlayer.classList.remove('my-turn');
        })

        for (var i = 0; i < table.players.length; i++) {
            if (table.players[i].myTurn == true) {
                if (i == 0) {
                    $('#player-one')[0].classList.add('my-turn')
                } else if (i == 1) {
                    $('#player-two')[0].classList.add('my-turn')
                } else if (i == 2) {
                    $('#player-three')[0].classList.add('my-turn')
                } else if (i == 3) {
                    $('#player-four')[0].classList.add('my-turn')
                }
            }
        }
    }

    displayWhosTurn();

    assert.notOk($('#player-one').hasClass('my-turn'), 'it is not player 1 turn');
    assert.notOk($('#player-two').hasClass('my-turn'), 'it is not player 2 turn');
    assert.ok($('#player-three').hasClass('my-turn'), 'it is player 3 turn');
    assert.notOk($('#player-four').hasClass('my-turn'), 'it is not player 4 turn');

    finishMyTurn('test3');
    assert.step('player 3 finished their turn')

    assert.notOk($('#player-one').hasClass('my-turn'), 'it is not player 1 turn');
    assert.notOk($('#player-two').hasClass('my-turn'), 'it is not player 2 turn');
    assert.notOk($('#player-three').hasClass('my-turn'), 'it is not player 3 turn');
    assert.ok($('#player-four').hasClass('my-turn'), 'it is player 4 turn');

    finishMyTurn('test4');
    assert.step('player 4 finished their turn')

    assert.ok($('#player-one').hasClass('my-turn'), 'it is player 1 turn');
    assert.notOk($('#player-two').hasClass('my-turn'), 'it is not player 2 turn');
    assert.notOk($('#player-three').hasClass('my-turn'), 'it is not player 3 turn');
    assert.notOk($('#player-four').hasClass('my-turn'), 'it is not player 4 turn');
})