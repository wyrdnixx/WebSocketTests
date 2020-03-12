<template>

    <div class="hello">
        <h1>{{ msg }}</h1>
        <!-- <button type="button" @click='connent()'>Verbinden</button> -->

        <div v-show="!(this.connection.readyState ===1)">
        
        Player name:
        <input type="text" v-model="ThisPlayerName">
        
        <button v-bind:disabled="ThisPlayerName === ''" type="button" @click='connect(ThisPlayerName)'>Host a new Game</button>
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

                <!-- {{ socketMessage === "" ? 'nothing' : socketMessage }} -->

                Players:
               <!--  {{Players === [] ? 'Nicht verbunden' : Players}} -->

                <li v-for="pl in this.Players" v-bind:key="pl.Name">{{pl.UUID}} : {{pl.Name}}</li>

                <div>
                    Connectionstate:
                     {{ this.connection.readyState  }}
                </div>
            </div>
        </div>
</template>

<script>
  import Player from '../Classes/Player'
        export default {
            name: 'ManageProcessors',
            components: {},
            data() {
                return {
                    connection: "", 
                    Players: [], 
                    Player: Player,
                    ThisPlayerName: "",
                    that:"",
                    GameId:""
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
                },
                connect(_ThisPlayerName) {
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
                            "MyPlayerName" : _ThisPlayerName
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
                                if (el === "Players") {
                                    that.Players = []
                                    //Passt :-)
                                    //console.log(json)
                                    json.Players.forEach(element => {
                                            console.log(element.Name)

                                            that.Players.push(new Player(element.UUID, element.Name, element.RemoteAddress, element.Port));


                                        });
                                }
                        }
                        console.log(this);
                        /*  that
                        .sockets
                        .push(this.url)
                    that.socketMessage = JSON.stringify(json.data);

                    */

                    };
                    this.connection.onclose = function () {
                        that.Players = []
                        console.log("closed connection");
                    };

                }
            }

        }

</script>