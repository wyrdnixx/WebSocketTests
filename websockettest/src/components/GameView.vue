<template v-on:visible="created()">

<div>
    Game is on

    <br>
    <br>
    Your GameId:  {{this.$parent.GameId}}
    <br>
    GameRev = {{GameRev.UUID}}
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
                console.log("in created in GameView")
                this.Players = []
                    console.log("GameRev: ",JSON.stringify(this.GameRev))
            },
            methods: {

            }
        }
</script>