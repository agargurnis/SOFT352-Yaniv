class Table {
    constructor() {
        this.cards = ['2-D', '2-C', '2-H', '3-S', '3-D', '3-C', '3-H', '3-S', '4-D', '4-C', '4-H', '4-S', '5-D', '5-C', '5-H', '5-S', '6-D', '6-C', '6-H', '6-S', '7-D', '7-C', '7-H', '7-S', '8-D', '8-C', '8-H', '8-S', '9-D', '9-C', '9-H', '9-S', '10-D', '10-C', '10-H', '10-S', 'jack-D', 'jack-C', 'jack-H', 'jack-S', 'queen-D', 'queen-C', 'queen-H', 'queen-S', 'king-D', 'king-C', 'king-H', 'king-S', 'ace-D', 'ace-C', 'ace-H', 'ace-S', 'joker-R', 'joker-B'];
        this.players = new Array();
    }
}
// instantiate a game object
const table = new Table();

$(document).ready(function () {
    // make connection
    var socket = io.connect('http://localhost:4000');
    // query dom buttons
    var sendBtn = $('#send-btn')[0];
    var createBtn = $('#create-btn')[0];
    var logOutBtn = $('#log-out-btn')[0];
    // query form input fields
    var messageField = $('#message-input')[0];
    // query form output fields
    var chatOutput = $('#chat-output')[0];
    var gameOutput = $('#game-output')[0];
    var typingDetector = $('#typing-detector')[0];
    // retrieve player object from local storage
    var urlString = window.location.href;
    var url = new URL(urlString);
    var playerKey = url.searchParams.get("name");
    var player = JSON.parse(localStorage.getItem(playerKey));
    // creates a new game and save it to the database
    function createGame() {
        var tableData = {
            "name": player["username"] + "-table",
            "username": player["username"]
        }
        axios
            .post('/api/game/create', tableData)
            .then(response => {
                table["players"].push(player);
                localStorage.setItem(tableData.name, JSON.stringify(table));
                socket.emit('game-created', player["username"]);
                window.location.href = "http://localhost:4000/game?table=" + tableData.name + "&name=" + player["username"];
            })
            .catch(error => {
                if (error == 'Error: Request failed with status code 400') {
                    if (window.confirm('It looks like you already have created a game! Are you sure you want to delete your old game and create a new one?')) {
                        localStorage.removeItem(tableData.name);
                        deleteGame(tableData);
                    }
                }
            });
    }
    // ajax function to join the game and save player to database
    function axiosJoin(tableData, tableName) {
        axios
            .post('/api/game/join', tableData)
            .then(response => {
                for (var i = 0; i < response.data.players.length; i++) {
                    table["players"].push({
                        username: response.data.players[i],
                        cardsOnHand: new Array(),
                        myTurn: false,
                        pointsOnHand: 0,
                        totalPoints: 0
                    });
                }
                localStorage.setItem(tableName, JSON.stringify(table));
                socket.emit('game-joined', tableName);
                window.location.href = "http://localhost:4000/game?table=" + tableName + "&name=" + player["username"];
            })
            .catch(error =>
                console.log(error)
            );
    }
    // joins an already created game
    function joinGame(tableId, tableName) {
        var tableData = {
            "tableId": tableId,
            "username": player["username"]
        }
        var gameTable = JSON.parse(localStorage.getItem(tableName));
        // check if the user has previously visited the same game
        if (gameTable !== null) {
            var thisTablePlayers = gameTable['players'];
            for (var i = 0; i < thisTablePlayers.length; i++) {
                // if the user already exists on table then redirect him to the game table
                if (thisTablePlayers[i].username == player['username']) {
                    window.location.href = "http://localhost:4000/game?table=" + tableName + "&name=" + player["username"];
                    return;
                }
            }
            // if there is a local storage item with the same name but no player in it then join the game
            axiosJoin(tableData, tableName);
            return;
        } else {
            // else if its the first time then add him to the game object in the local storage and add the user to the database
            axiosJoin(tableData, tableName);
        }
    };
    // delete the table from database
    function deleteGame(tableData) {
        axios
            .post('/api/game/delete', tableData)
            .then(response => {
                createGame();
            })
            .catch(error =>
                console.log(error)
            );
    }
    // sets the buttons to join available games
    function setGameButtons() {
        $('.game-button').each(function () {
            var tableName = $(this)[0].firstChild.textContent;
            var tableId = $(this)[0].id;

            $(this)[0].addEventListener('click', function () {
                joinGame(tableId, tableName);
            })
        })
    }
    // displays available games to join
    function getGames() {
        axios
            .get('/api/game')
            .then(response => {
                gameOutput.innerHTML = '';
                response.data.map(table => {
                    if (table.started !== true) {
                        gameOutput.innerHTML += '<p id="' + table._id + '" class="game-button pointer"><strong class="game-table-name">' + table.name + '</strong><br/>Players: ' + table.players.length + '/4</p>';
                    }
                });
                setGameButtons();
            })
            .catch(error =>
                console.log(error)
            );
    };
    // log out player and redirect to login screen
    logOutBtn.addEventListener('click', function () {
        localStorage.removeItem(playerKey);
        window.location.href = "http://localhost:4000";
    })
    // click the send button on the press of the enter key in message input field
    messageField.addEventListener('keyup', function (e) {
        e.preventDefault();
        // Number 13 is the "Enter" key on the keyboard
        if (e.keyCode === 13) {
            sendBtn.click();
        }
    });
    // creates a new game when button is pressed
    createBtn.addEventListener('click', function () {
        createGame();
    })
    // sends a message to the public chat
    sendBtn.addEventListener('click', function () {
        if (messageField.value !== '') {
            socket.emit('lobby-chat', {
                message: messageField.value,
                handle: player["username"]
            });
        }
        messageField.value = '';
    })
    // notifies other players that someone is typing
    messageField.addEventListener('keypress', function () {
        socket.emit('typing', player["username"]);
    })
    // notifies other players that a game is created
    socket.on('game-created', function (data) {
        chatOutput.innerHTML += '<p><strong>' + data + ' created a game</strong></p>';
        getGames();
    })
    // notifies other players that a game is joined
    socket.on('game-joined', function (data) {
        chatOutput.innerHTML += '<p><strong>' + data + ' has been joined</strong></p>';
        getGames();
    })
    // displays messages in the public chat to all the players
    socket.on('lobby-chat', function (data) {
        typingDetector.innerHTML = '';
        chatOutput.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
    })
    // displays messages in the public chat to all the players
    socket.on('game-started', function (data) {
        chatOutput.innerHTML += '<p><strong>' + data + ' has started</strong></p>';
        getGames();
    })
    // displays to other players that someone is typing
    socket.on('typing', function (data) {
        typingDetector.innerHTML = '<p><em>' + data + ' is typing...</em></p>';
    })
    // load game tables 
    window.onload = getGames();
});