<template v-on:visible="GameViewStarting()">

<div>
        
    <br>
    Active GameID = {{GameRev.UUID}}
<br>


<div id="wrapper">
    Players in the Game: <br>
    <ul>
    <li v-for="pl in GameRev.Players" v-bind:key="pl.Name">{{pl.UUID}} : {{pl.Name}}</li>
    </ul>
</div>

</div>

</template>


<script>


  import Player from '../Classes/Player'
        export default {
            name: 'GameView',
            components: {
                
            },
            data() {
                return {
                    Players: [], 
                    Player: Player,
                    ThisPlayerName: "",
                    that:"" 
                    
                    }
            },
            props: {
                msg: String,
                GameRev: {}
            },
            created() {
                
            },
            methods: {
                    GameViewStarting() {
                        console.log("in created in GameView")
                        this.Players = []
                        console.log("GameRev: ",JSON.stringify(this.GameRev))
                    }
            }
        }
</script>