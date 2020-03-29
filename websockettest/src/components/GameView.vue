<template v-on:visible="GameViewStarting()">

    <div>

        <div id="maincontainer">
            <div id="head" style="padding: 10px">
                <div class="card text-white bg-info mb-5" style="  height:100%; width: 50%; float: left;">
                    <div class="card-header">Game Info</div>
                    <div class="card-body">
                        <!-- <h5 class="card-title">Game Info</h5> -->
                        <p class="card-text">
                            Active GameID =
                            {{GameRev.UUID}}
                        </p>
                    </div>
                </div>
                <div class="card text-white bg-info mb-5 " style=" height:100%; width: 50%; float: right;">
                    <div class="card-header">Players</div>
                    <div class="card-body">
                        <!-- <h5 class="card-title">Game Info</h5> -->
                        <p class="card-text">
                            <ul>
                                <ul v-for="pl in GameRev.Players" v-bind:key="pl.Name">{{pl.Name}}
                                    :
                                    {{pl.UUID}}</ul>
                            </ul>
                        </p>
                    </div>

                </div>
            </div>
            <div class="card text-white bg-info mb-3" style="width: 100%;position: relative; ">
                Game Screen
                <br>
                ...
            </div>
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