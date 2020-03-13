class ConSvc {

    static Testmethod(_gameid) {
        console.log("!GameId aus ConSvc Klasse: ", _gameid)
        return null
    }

    static JoinGame(_ThisPlayerName, _gameId) {
        
        this.connection = new WebSocket('ws://192.168.1.53:3000')
        window.WebSocket = window.WebSocket || window.MozWebSocket;

        
        this.connection.onopen = function () {
            console.log("Connection Opened...")                        
             var transportMessage = {
            "transportMessage" : {
                "MyPlayerName" : _ThisPlayerName,
                "StartNewGame" : false,
                "JoinGameId" : _gameId
                }
            
        }
        this.send(JSON.stringify(transportMessage));
        };

        this.connection.onerror = function (error) {
            console.log("Connection Error: " + error)
        };


    }
    



}

export default ConSvc;