import Player from '../Classes/Player';
class ConSvc {
       

    static Testmethod(_gameid) {
        console.log("!GameId aus ConSvc Klasse: ", _gameid)
        return null
    }

    static NewSession (_this) {

        console.log("NewSession  MyPlayerName: ", _this.ThisPlayerName)
    }

    
    /**
     * Starts or joins a game
     * @param {*} _this webapp object (usualy this)
     * @param {*} _ThisPlayerName Playername entered 
     * @param {*} _gameId gameId of game to join or '0' if new game starting
     */

    static JoinGame(_this, _ThisPlayerName, _gameId) {
        
        this.connection = new WebSocket('ws://api.' + window.location.host)
        window.WebSocket = window.WebSocket || window.MozWebSocket;
        
        
        let that = this;
        
        this.connection.onopen = function () {
            console.log("Connection Opened...")  
            
         /*    var _startNewGame
            // _StartNewGame can be deleted when the server 
            // is changed to check the gameId to 0
            if(_gameId === 0) {
                _startNewGame = true
            } else {
                _startNewGame = false
            } */
             var transportMessage = {
            "transportMessage" : {
                "MyPlayerName" : _ThisPlayerName,
              /*   "StartNewGame" : _startNewGame, */
                "JoinGameId" : _gameId
                }
            
        }
        this.send(JSON.stringify(transportMessage));
        };


        this.connection.onmessage = function ( message) {            
        

            console.log("ConSvc got from Server: ", message)
            try {
                var json = JSON.parse(message.data);
            } catch (e) {
                console.log('This does not lock like a valid JSON: ', message.data);
                return;
            } 

            for (var el in json) {
                console.log('got Message: ', el)
                    
                    switch(el)
                    {
                        // got a Player List Update
                        case "Players":
                            that.Players = []
                            //Passt :-)
                            //console.log(json)
                            json.Players.forEach(element => {
                                    console.log(element.Name)
                                    that.Players.push(new Player(element.UUID, element.Name, element.RemoteAddress, element.Port));
                                });
                            break;

                        case "Game":
                            console.log("ConSvc updating Game: ", json.Game )
                      /*       that.GameId = json.Game.UUID

                            // reverenziere das neue Game -> Wird damit an GameComponent übergeben
                            that.GameRev = json.Game
 */
                                _this.updateGame(json.Game)
                            break;

                        default:
                            // nothing
                    }
                    
                    
                    }
        }


        this.connection.onerror = function (error) {
            console.log("Connection Error: " + error)
        };


    }
    



}

export default ConSvc;