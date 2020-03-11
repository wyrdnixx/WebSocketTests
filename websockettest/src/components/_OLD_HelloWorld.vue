<template>

    <div class="hello">
        <h1>{{ msg }}</h1>
        <!-- <button type="button" @click='connent()'>Verbinden</button> -->
        <button type="button" @click='connect()'>Verbinden</button>

        <button type="button" @click='update()'>Update</button>
        <button type="button" @click='close()'>Close</button>

        <br>

            <!-- <button type="button" @click='testmethode()'>TestFunc</button> -->
            <div>

                <!-- {{ socketMessage === "" ? 'nothing' : socketMessage }} -->

                Players:
                {{Players === "" ? 'Nicht verbunden' : Players}}

                <div>
                    Connectionstate:
                    {{ this.connection.readyState}}
                </div>
            </div>
        </div>
    </template>

    <script>
        // import func from '../../../vue-temp/vue-editor-bridge'; import _ from
        // 'lodash';
        import Player from '../Classes/Player'
        export default {
            name: 'ManageProcessors',
            components: {},
            data() {
                return {connection: WebSocket, Players: [], Player: Player}
            },
            props: {
                msg: String
            },
            created() {
                this.Players = []
                this.connection = new WebSocket('ws://192.168.1.53:3000')
                console.log("Players: ", this.Players);

                this.Player = new Player("Hans", "10", "010101");

                this
                    .Players
                    .push(this.Player)
            },
            methods: {

                update() {
                    this
                        .connection
                        .send('reqUpdate')
                    console.log("Connetion: ", this.connection)

                },

                close() {
                    console.log(this.connection)
                    this
                        .connection
                        .close();
                    console.log("Closed: ", this.connection)
                },

                connect() {
                    let that = this;

                    this.socketMessage = "Halloo"

                    console.log("Connecting")
                    window.WebSocket = window.WebSocket || window.MozWebSocket;

                    this.connection.onopen = function () {
                        console.log("Connection Opened...")
                    };

                    this.connection.onerror = function (error) {
                        console.log("Connection Error: " + error)
                    };

                    this.connection.onmessage = function (message) {
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
                            if (el === "clients") {

                                var keysArray = Object.keys(json);
                                for (var i = 0; i < keysArray.length; i++) {
                                    var key = keysArray[i]; // here is "name" of object property
                                    var value = json[key]; // here get value "by name" as it expected with objects
                                    console.log(key);
                                    console.log(value);
                                    var cl = JSON.parse(value)
                                    that
                                        .Players
                                        .push(cl)
                                }

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
                        console.log("closed connection");
                    };

                }
            }

        }
    </script>

    <!-- Add "scoped" attribute to limit CSS to this component only -->
    <style scoped="scoped">
        h3 {
            margin: 40px 0 0;
        }
        ul {
            list-style-type: none;
            padding: 0;
        }
        li {
            display: inline-block;
            margin: 0 10px;
        }
        a {
            color: #42b983;
        }
    </style>