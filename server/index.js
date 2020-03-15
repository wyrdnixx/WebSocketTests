var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
require('dotenv').config();
// UUID Generator for unice UUID Strings
var uuid = require('uuid-random');



var app = express();
app.use(bodyParser.json());
app.use(cors());

var testString = "Hallo \n dies ist ein Test-String";
const port = process.env.PORT || 3000;


var WebSocketServer = require('websocket').server;
var http = require('http');

//var Client = require('./modules/client')

var Players = [];
var Player = require('./classes/Player')

var Game = require('./classes/Game')
var Games = [];

var PlayerCon = require('./classes/PlayerCon')
var Connections = [];

var server = http.createServer(function(request, response) {

});

server.listen(port, function() {
    console.log("Server started...")
});

app.get('/', function (req,res) {
    console.log('Got request: '. req)
    res.sendUTF('Hallo')
})

wsServer = new WebSocketServer ({
    httpServer: server
});


wsServer.on('request', function(request) {

    


    console.log((new Date()) + ' Connection from origin '
    + request.origin + '.');

    var connection = request.accept(null, request.origin);
    console.log("peer: ", connection.socket.remoteAddress);
    console.log("peer: ", connection.socket._peername.port);




    //var cl = new Client(connection.socket.remoteAddress, connection.socket._peername.port);

    
    //connections.push(connection);


    //console.log("Client Object address: ", cl.Name , cl.Ip, cl.Port);

    //var index = clients.push(connection) - 1;
    console.log((new Date()) + ' Connection accepted.');
    
    //updateClients();

    connection.on('message', function(message) {
        console.log("Socket got: ", message)
        if (message.type === 'utf8') {
            console.log("Got Message: ", message.utf8Data)

         


            for (var key in JSON.parse(message.utf8Data)) {
                if (key === "transportMessage" ) {
                    console.log("Got transportMessage")

                    var msgObj = JSON.parse(message.utf8Data)                
                    for (var k in msgObj.transportMessage) {
                        console.log("got transportMessage Key: ", k)
    
                        // New Player submits its PlayerName         
                        if (k === "MyPlayerName") {
                        //console.log("PlayerName Update: ", msgObj.transportMessage.MyPlayerName)
                        
                        }


                       // Client requests new Game start
                       if (k === 'StartNewGame' && msgObj.transportMessage.StartNewGame === true) {
                        console.log('Client request new game to start: ');
                        var newGameId = uuid().slice(0,5);
                        console.log("New Game ID: ", newGameId)
                        
                        // Games Array update
                        var newGame = new Game(newGameId)
                        Games.push(newGame) 
                        var _game = {
                            "Game" : newGame
                        }                                                

                        
                        pl = new Player(uuid(), msgObj.transportMessage.MyPlayerName)
                        console.log("New Player created: ", pl.UUID)
                        Players.push(pl);
                        
                        var con = new PlayerCon(pl.UUID,this)
                        Connections.push(con)


                        newGame.Players.push(pl)




                        
                        // Players Array update
                       /*  pl = new Player(uuid(), connection, msgObj.transportMessage.MyPlayerName)
                        console.log("New Player created: ", pl.UUID)
                        Players.push(pl); */
                        
                        // Connections Array update
                        //var plcon = new PlayerCon(pl.UUID, connection)
                        //Connections.push(plcon)

                        //updateClients();
                        console.log("Sending new game: ", _game)
                        this.send(JSON.stringify(_game))
                    } 

                    // Client try to join game
                    if (k=== 'StartNewGame'&& msgObj.transportMessage.StartNewGame === false) {

                        console.log("Player : ", msgObj.transportMessage.MyPlayerName,
                                        " trying to join game: ", msgObj.transportMessage.JoinGameId)
                        
                                        // checking if requested Game exists
                        for(var gm in Games) {
                            console.log("Checking existing Game: ", Games[gm])
                            if (Games[gm].UUID === msgObj.transportMessage.JoinGameId ) {
                                console.log("Found existing Game")
                                
                                
                                
                                pl = new Player(uuid(), msgObj.transportMessage.MyPlayerName)
                                console.log("New Player created: ", pl.UUID)
                                Players.push(pl);
                        
                                var con = new PlayerCon(pl.UUID,this)
                                Connections.push(con)
                                
                                
                                
                                Games[gm].Players.push(pl)
                                console.log(Games[gm])
                               // this.sendUTF(Games[gm])
                               
                               // update clients based on current connection
                               //updateGameClients(this)
                               updateClients(Games[gm]);
                            }
                        }

                        


                    }

                     /*   // Client requests for Playerlist update
                        if (k === 'reqUpdate') {
                            console.log('Client request update: ', connection.socket.remoteAddress, ':', connection.socket._peername.port);
                            updateClients();
                        }  */
                    }
    
                }
            }

            

            
            
         
            


        } else {
            console.log("no UTF-Message: ", message)
        }
    });

    connection.on('close', function(connection) {
        
        console.log("Closing connection: ", this.socket.remoteAddress, " Port: ", this.socket._peername.port )

/* 
        Players.forEach((pl, index) => {
            console.log("Checking Players: ", index, " : ", pl.Connection.socket.remoteAddress, ":",pl.Connection.socket._peername.port )

            if (pl.Connection.socket.remoteAddress === this.socket.remoteAddress &&
                pl.Connection.socket._peername.port === this.socket._peername.port) {
                    console.log("Found...")
                    Players.splice(index,1)
                }
        })
 */

       /*  // Delete client from clientarray
        clients.forEach((cl,index) => {

            console.log("Client: ", cl.RemoteAddress, " Port: ", cl.Port)
            if (cl.RemoteAddress === this.socket.remoteAddress && cl.Port === this.socket._peername.port) {
                console.log("Found client to delete: ",index," - ", cl.RemoteAddress, ":",cl.Port )
                clients.splice(index,1)
            }
        })
        
        // Delete connection from connectionarray
        connections.forEach((con, index) => {
            if( con === this) {
                console.log("Found connection to delete: ",index," - ", this.socket._peername)
           connections.splice(index,1)           
           }
        });
        console.log("Clients in con-close: ", clients) */




        //updateClients();
    });
});


/* function updateGameClients(_requestingConnection) {

    console.log("Updating GameClients")
    for(var gm in Games) {
        console.log("Game: ", Games[gm])

        for(var player in Games[gm].Players) {
            console.log("Player: ", Games[gm].Players[player].UUID)
                                 
            
            
                console.log("Updating player: ", pl.UUID)
                Games[gm].Players[player].Connection.sendUTF(Games[gm]);
         
         
        }

    }

}
 */

function updateClients(_g) {

    var _game = {
        "Game" : _g
    } 


    console.log("updating player of game: ", _game.Game.UUID) 
    //console.log("checking Connections: ", Connections)
    for (var x in _game.Game.Players) {
        console.log("Game: ", _game.Game.UUID , " - Player: ", _game.Game.Players[x].UUID )

        for (var con in Connections) {
            console.log("checking Connection: ", Connections[con].UUID)
            if (Connections[con].UUID ===  _game.Game.Players[x].UUID){
                console.log("Connection found... Updating...",Connections[con].Connection.socket.remoteAddress )
                Connections[con].Connection.sendUTF(JSON.stringify(_game))
            }
        }


    }

    /* _game.Players.forEach((pl) => {
        console.log("Player: ", pl.UUID)
    }); */


    /* var Playerlist = {
        "Players": [                     
        ]
    };

       Players.forEach(pl => {
           
           tmpPl = new Player(pl.UUID,null,pl.Name)
           Playerlist.Players.push(tmpPl)
    });
   console.log("Updated Playerlist for sending: ", JSON.stringify(Playerlist))
    


    Players.forEach((pl, index) => {
        console.log("Updating Clients - Player: ",pl.Name, " : ", pl.Connection.socket.remoteAddress , " : ", pl.Connection.socket._peername.port)
        //console.log(Playerlist)
        pl.Connection.sendUTF(JSON.stringify(Playerlist));
    }) */
 

}
