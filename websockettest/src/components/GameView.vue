<template>

<div>
    Game is on
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
                
            }
        }
</script>