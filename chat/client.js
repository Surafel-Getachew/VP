const WebSocket = require("uws")
const ws = new WebSocket("ws://localhost:2000");

ws.on("open",() => {
    console.log("successfuly connected to the server")
})
