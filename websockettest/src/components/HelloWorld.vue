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
            <GameView  :GameRev=GameRev></GameView>
        </div>
        
        <!-- <GameView v-show="this.GameIsRunning" :GameRev=GameRev></GameView> -->
        
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
                        //this.newGameOld(this.ThisPlayerName)
                        // new game starting 
                        console.log("helloworld is starting new game...")
                        ConSvc.JoinGame(this, this.ThisPlayerName,0)
                    }else {
                        // join existing game
                        console.log("helloworld is trying to join game...")
                        ConSvc.JoinGame(this, this.ThisPlayerName,this.GameId)
                    }

                    //ConSvc.NewSession(this);
                }

                
            }

        }

</script>
