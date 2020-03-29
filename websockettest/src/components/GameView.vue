<template v-on:visible="GameViewStarting()">

    <div>
        
            <div class="alert alert-info">
                
            </div>
        
<div class="card text-white bg-info mb-3" style="max-width: 18rem;">
  <div class="card-header">Game Info</div>
  <div class="card-body">
   <!--  <h5 class="card-title">Game Info</h5> -->
    <p class="card-text">
        Active GameID = {{GameRev.UUID}}
        </p>
  </div>
    </div>

        

        <div id="wrapper_right">
            Players in the Game:
            <br>
                <ul>
                    <li v-for="pl in GameRev.Players" v-bind:key="pl.Name">{{pl.UUID}}
                        :
                        {{pl.Name}}</li>
                </ul>
            </div>

        </div>

    </template>

    <script>

        import Player from '../Classes/Player'
        export default {
            name: 'GameView',
            components: {},
            data() {
                return {Players: [], Player: Player, ThisPlayerName: "", that: ""}
            },
            props: {
                msg: String,
                GameRev: {}
            },
            created() {},
            methods: {
                GameViewStarting() {
                    console.log("in created in GameView")
                    this.Players = []
                    console.log("GameRev: ", JSON.stringify(this.GameRev))
                }
            }
        }
    </script>