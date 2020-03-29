var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
require('dotenv').config();
// UUID Generator for unice UUID Strings
var uuid = require('uuid-random');

var _ = require('lodash');

var app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3000;

var WebSocketServer = require('websocket').server;
var http = require('http');

var GameSvc = require('./modules/GameSvc')

var Players = [];
var Player = require('./classes/Player')

var Game = require('./classes/Game')
var Games = [];

var PlayerCon = require('./classes/PlayerCon')
var Connections = [];

var server = http.createServer(function (request, response) {});

server.listen(port, function () {
    console.log("Server started...")
});

app.get('/', function (req, res) {
    console.log('Got request: '.req)
    res.sendUTF('Hallo')
})

wsServer = new WebSocketServer({httpServer: server});

wsServer.on('request', function (request) {

    GameSvc.testfunc("test")

    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    var connection = request.accept(null, request.origin);
    console.log("peer: ", connection.socket.remoteAddress);
    console.log("peer: ", connection.socket._peername.port);

    // var cl = new Client(connection.socket.remoteAddress,
    // connection.socket._peername.port); connections.push(connection);
    // console.log("Client Object address: ", cl.Name , cl.Ip, cl.Port); var index =
    // clients.push(connection) - 1;
    console.log((new Date()) + ' Connection accepted.');

    //updateClients();

    connection.on('message', function (message) {
        console.log("Socket got: ", message)
        if (message.type === 'utf8') {
            console.log("Got Message: ", message.utf8Data)

            for (var key in JSON.parse(message.utf8Data)) {
                if (key === "transportMessage") {
                    console.log("Got transportMessage")

                    var msgObj = JSON.parse(message.utf8Data)
                    for (var k in msgObj.transportMessage) {
                        console.log("got transportMessage Key: ", k)

                        
                        if (k === "JoinGameId") {
                        

                        switch (msgObj.transportMessage.JoinGameId) {
                                // Client requests new Game start
                            case 0:
                                console.log("New Game start requested...")
                                console.log('Client request new game to start: ');
                                var newGameId = uuid().slice(0, 5);
                                console.log("New Game IDcreated: ", newGameId)

                                // Games Array update
                                var newGame = new Game(newGameId)
                                Games.push(newGame)
                                var _game = {
                                    "Game": newGame
                                }

                                pl = new Player(uuid(), msgObj.transportMessage.MyPlayerName)
                                console.log("New Player created: ", pl.UUID)
                                Players.push(pl);

                                var con = new PlayerCon(pl.UUID, this)
                                Connections.push(con)

                                newGame
                                    .Players
                                    .push(pl)

                                console.log("Sending new game: ", _game)
                                this.send(JSON.stringify(_game))
                                break;
                                // Client try to join game
                            default:
                                console.log(
                                    "Player : ",
                                    msgObj.transportMessage.MyPlayerName,
                                    " trying to join game: ",
                                    msgObj.transportMessage.JoinGameId
                                )

                                // leerzeichen entfernen
                                JoinGameId = msgObj
                                    .transportMessage
                                    .JoinGameId
                                    .trim()
                                // checking if requested Game exists
                                for (var gm in Games) {
                                    //console.log("Checking existing Game: ", Games[gm])
                                    if (Games[gm].UUID === JoinGameId) {
                                        console.log("Found existing Game")

                                        pl = new Player(uuid(), msgObj.transportMessage.MyPlayerName)
                                        console.log("New Player created: ", pl.UUID)
                                        Players.push(pl);

                                        var con = new PlayerCon(pl.UUID, this)
                                        Connections.push(con)

                                        Games[gm]
                                            .Players
                                            .push(pl)
                                        console.log(Games[gm])
                                        // this.sendUTF(Games[gm]) update clients based on current connection
                                        // updateGameClients(this)
                                        updateClients(Games[gm]);
                                    } else {
                                        console.log("not this game: ", Games[gm].UUID )
                                    }
                                }
                                break;
                        }         
                    }
                    }

                }
            }

        } else {
            console.log("no UTF-Message: ", message)
        }
    });

    connection.on('close', function (connection) {

        console.log(
            "OnClose closing connection: ",
            this.socket.remoteAddress,
            " Port: ",
            this.socket._peername.port
        )

        var current = _.findIndex(Connections, {'Connection': this})
        console.log("Connection Array: ", current)
        console.log("PlayerUUID from Connections: ", Connections[current].UUID)

        for (var x in Games) {
            console.log("Check Game: ", Games[x].UUID)
            var _i = _.findIndex(Games[x].Players, {'UUID': Connections[current].UUID})

            if (_i >= 0) {
                Games[x]
                    .Players
                    .splice(_i, 1)
                updateClients(Games[x])
            }

        }

        /* for (var con in Connections) {

                console.log("onclose checking connection: ", Connections[con].UUID)

            if (Connections[con].Connection === connection) {
                console.log("Connection to close found...")
                for (var x in that.Games){
                    for (var pl in that.Games[x].Players) {
                        console.log("Players: ", that.Games[x].Players[pl])
                    }
                }
            }
        } */
    });
});

function updateClients(_g) {

    var _game = {
        "Game": _g
    }

    console.log("updating player of game: ", _game.Game.UUID)
    //console.log("checking Connections: ", Connections)
    for (var x in _game.Game.Players) {
        console.log(
            "Game: ",
            _game.Game.UUID,
            " - Player: ",
            _game.Game.Players[x].UUID
        )

        for (var con in Connections) {
            //console.log("checking Connection: ", Connections[con].UUID)
            if (Connections[con].UUID === _game.Game.Players[x].UUID) {
                console.log(
                    "Connection found... Updating...",
                    Connections[con].Connection.socket.remoteAddress
                )
                Connections[con]
                    .Connection
                    .send(JSON.stringify(_game))
            }
        }

    }

}
