<template>

    <div class="hello">
        <h1>{{ msg }}</h1>
        <!-- <button type="button" @click='connent()'>Verbinden</button> -->

        <div v-show="!GameIsRunning">

            <table border="0"> 
                <tr>
                    <td>Player name: </td>
                    <td><input type="text" v-model="ThisPlayerName"></td>
                     <td rowspan="2"><button style="height:100%" v-bind:disabled="ThisPlayerName === ''" type="button" @click='newGame(ThisPlayerName)'> {{GameId === '' ? 'Host a new Game' : 'Join Game' }}</button></td>
                </tr>
                <tr>
                    <td>GameID: </td>
                    <td><input  type="text" v-model="GameId"></td>                   
                    
                </tr>
            </table>          
            
            
            <br>
            
           <!--  <button v-bind:disabled="GameId === ''" type="button" @click='joinGame(GameId)'>Join Game</button>             -->
        </div>
        <br>
        <div v-show="GameIsRunning">            
            <button type="button" @click='close()'>Close</button>
        
        
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
        </div>
       
        
        GameView:
        <GameView v-show="this.GameIsRunning" :GameRev=GameRev></GameView>
        
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
                    GameRev: {},
                    GameIsRunning: false
                    }
            },
            props: {
                msg: String
            },
            created() {
                this.Players = []
                console.log("Current Website: ", window.location.host)
                
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
                    console.log("updateGame updating")
                    this.GameRev = _game  
                    this.GameIsRunning = true      
                },
                close() {
                    console.log("This.Connection = ", this.connection)
                    
                    // Im moment noch doppelt - solange new game und join noch getrennt
                    try {
                        ConSvc.connection.close();
                    }catch (e) {
                            console.log(e)
                    }                        
                    try {
                        this.connection.close();
                    }catch  (e){
                        console.log(e)
                    }
                     
                    
                    
                    

                    console.log("Closed: ", this.connection)
                    this.GameIsRunning = false
                },
                /* joinGame(_gameId){
                    //join a game
                    console.log("Gamejoin started... : ", _gameId)                  
                    
                    ConSvc.JoinGame(this, this.ThisPlayerName,_gameId)
                }, */
                
                newGame() {

                    if(this.GameId==='') {
                        this.newGameOld(this.ThisPlayerName)
                    }else {
                        ConSvc.JoinGame(this, this.ThisPlayerName,this.GameId)
                    }

                    //ConSvc.NewSession(this);
                },
                newGameOld(_ThisPlayerName) {
                    console.log("Connect called")
                  
                    this.connection = new WebSocket('ws://api.' + window.location.host)
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
                                        that.updateGame(json.Game)
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
