<template>

    <div class="hello">
        <h1>{{ msg }}</h1>
        <!-- <button type="button" @click='connent()'>Verbinden</button> -->

        <div v-show="!(this.connection.readyState ===1)">
        
        Player name:
        <input type="text" v-model="ThisPlayerName">
        
        <button v-bind:disabled="ThisPlayerName === ''" type="button" @click='newGame(ThisPlayerName)'>Host a new Game</button>
        <br>
        GameID: <input v-if="!(this.connection.readyState === 1)" type="text" v-model="GameId">
        <button v-bind:disabled="GameId === ''" type="button" @click='joinGame(GameId)'>Join Game</button>
        <br>
        </div>


        <div v-show="this.connection.readyState === 1">
            <button type="button" @click='update()'>Update</button>
            <button type="button" @click='close()'>Close</button>
        </div>
        
            <div>                
                Players: <br>
               <!--  {{Players === [] ? 'Nicht verbunden' : Players}} -->
                <li v-for="pl in this.Players" v-bind:key="pl.Name">{{pl.UUID}} : {{pl.Name}}</li>
                <div>
                    Connectionstate:
                     {{ this.connection.readyState  }}      
                     GameId = {{this.GameId}}
                </div>
            </div>
    
        <GameView v-show="this.connection.readyState ===1" :GameRev=GameRev></GameView>
        
        GameView:
        <GameView v-show="this.GameId !==''" :GameRev=GameRev></GameView>
        
    </div>
</template>

<script>
import GameView from './GameView.vue';
import ConSvc from './ConSvc';
import Player from '../Classes/Player';

        export default {
            name: 'WelcomeScreen',
            components: {
                GameView                
            },
            data() {
                return {
                    connection: {}, 
                    Players: [], 
                    Player: Player,
                    ThisPlayerName: "",
                    that:"",
                    GameId:"",
                    GameRev: {}
                    }
            },
            props: {
                msg: String
            },
            created() {
                this.Players = []
                
            },
            methods: {

                update() {

                    /* 
                    this
                        .connection
                        .send('reqUpdate') */
                    console.log("Connetion: ", this.connection)
                    var transportMessage = {
                        "transportMessage" : {
                            "reqUpdate" : ""
                            }
                        
                    }
                    this.connection.send(JSON.stringify(transportMessage));
                },
                updateGame(_game) {
                    console.log("updateGame updating GameRev")
                    this.GameRev = _game        
                },
                close() {
                    console.log(this.connection)
                    this
                        .connection
                        .close();
                    console.log("Closed: ", this.connection)
                },
                joinGame(_gameId){
                    //join a game
                    console.log("Gamejoin started... : ", _gameId)
                    
                  
                    
                    ConSvc.JoinGame(this, this.ThisPlayerName,_gameId)
                },
                newGame(_ThisPlayerName) {
                    console.log("Connect called")
                  
                    this.connection = new WebSocket('ws://192.168.1.53:3000')
                     window.WebSocket = window.WebSocket || window.MozWebSocket;

                    let that = this;
                    

                    console.log("Connecting")
                    //verschoben in created
                   

                    // Send current Playername

                    
                   

                    this.connection.onopen = function () {
                        console.log("Connection Opened...")                        
                         var transportMessage = {
                        "transportMessage" : {
                            "MyPlayerName" : _ThisPlayerName,
                            "StartNewGame" : true
                            }
                        
                    }
                    this.send(JSON.stringify(transportMessage));
                    };

                    this.connection.onerror = function (error) {
                        console.log("Connection Error: " + error)
                    };

                    this.connection.onmessage = function (message) {
                        console.log("Got from Server: ", message)
                      
                      
                         try {
                            var json = JSON.parse(message.data);
                        } catch (e) {
                            console.log('This does not lock like a valid JSON: ', message.data);
                            return;
                        } 
                        console.log(that);
                        console.log('got JSON: ', JSON.stringify(json))
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
                                        console.log("got new GameId: ", json.Game )
                                        that.GameId = json.Game.UUID

                                        // reverenziere das neue Game -> Wird damit an GameComponent übergeben
                                        that.GameRev = json.Game
                                        break;

                                    default:
                                        // nothing
                                }
                                
                                
                                }
                        }
                        console.log(this);
                        /*  that
                        .sockets
                        .push(this.url)
                    that.socketMessage = JSON.stringify(json.data);

                    */
                
                    
                    this.connection.onclose = function () {
                        that.Players = []
                        console.log("closed connection");
                    };

                }
            }

        }

</script>