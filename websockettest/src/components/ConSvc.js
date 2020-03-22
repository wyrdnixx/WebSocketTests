import Player from '../Classes/Player';
class ConSvc {
       

    static Testmethod(_gameid) {
        console.log("!GameId aus ConSvc Klasse: ", _gameid)
        return null
    }

    static JoinGame(_this, _ThisPlayerName, _gameId) {
        
        this.connection = new WebSocket('ws://192.168.1.53:3000')
        window.WebSocket = window.WebSocket || window.MozWebSocket;
        
        
        let that = this;
        
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