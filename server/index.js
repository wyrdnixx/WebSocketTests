var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
require('dotenv').config();
 

var app = express();
app.use(bodyParser.json());
app.use(cors());

var testString = "Hallo \n dies ist ein Test-String";
const port = process.env.PORT || 3000;


var WebSocketServer = require('websocket').server;
var http = require('http');

//var Client = require('./modules/client')

var Player = require('./classes/Player')


var Players = [];
//var connections = [];

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
    
    updateClients();

    connection.on('message', function(message) {
        console.log("Socket got: ", message)
        if (message.type === 'utf8') {
            console.log("Got Message: ", message.utf8Data)


          /*   // Client requests for Playerlist update
            if (message.utf8Data === 'reqUpdate') {
                console.log('Client request update: ', connection.socket.remoteAddress, ':', connection.socket._peername.port);
                updateClients();
            } */
            
            /* 
            // Beispiel TransportMessage JSON:
            {
            type: 'utf8',
            utf8Data: '{"transportMessage":{"MyPlayerName":"asdf"}}'
            } 
            */


            for (var key in JSON.parse(message.utf8Data)) {
                if (key === "transportMessage" ) {
                    console.log("Got transportMessage")

                    var msgObj = JSON.parse(message.utf8Data)                
                    for (var k in msgObj.transportMessage) {
                        console.log("Found Key: ", k)
    
                        // New Player submits ist PlayerName         
                        if (k === "MyPlayerName") {
                        console.log("PlayerName Update: ", msgObj.transportMessage.MyPlayerName)
                        pl = new Player(connection,msgObj.transportMessage.MyPlayerName)
                        Players.push(pl);
                        updateClients();
                        }

                       // Client requests for Playerlist update
                        if (k === 'reqUpdate') {
                            console.log('Client request update: ', connection.socket.remoteAddress, ':', connection.socket._peername.port);
                            updateClients();
                        } 
                    }
    
                }
            }

            

            
            
         
            


        } else {
            console.log("no UTF-Message: ", message)
        }
    });

    connection.on('close', function(connection) {
        
        console.log("Closing connection: ", this.socket.remoteAddress, " Port: ", this.socket._peername.port )


        Players.forEach((pl, index) => {
            console.log("Checking Players: ", index, " : ", pl.Connection.socket.remoteAddress, ":",pl.Connection.socket._peername.port )

            if (pl.Connection.socket.remoteAddress === this.socket.remoteAddress &&
                pl.Connection.socket._peername.port === this.socket._peername.port) {
                    console.log("Found...")
                    Players.splice(index,1)
                }
        })


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

        updateClients();
    });
});



function updateClients() {

    var Playerlist = {
        "Players": [                     
        ]
    };

       Players.forEach(pl => {
           
           tmpPl = new Player(null,pl.Name)
           Playerlist.Players.push(tmpPl)
    });
   console.log("Updated Playerlist for sending: ", JSON.stringify(Playerlist))
    


    Players.forEach((pl, index) => {
        console.log("Updating Clients - Player: ",pl.Name, " : ", pl.Connection.socket.remoteAddress , " : ", pl.Connection.socket._peername.port)
        //console.log(Playerlist)
        pl.Connection.sendUTF(JSON.stringify(Playerlist));
    })


}
