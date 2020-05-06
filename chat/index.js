// const http = require ("http");
// const express = require("express");
// const morgan = require("morgan");
// const WebSocketServer= require("uws").Server;

// const port = 2000 || process.env.PORT;

// const app = express();

// app.server = http.createServer(app);

// app.use(express.json({extended:false}));



// app.wss = Server({
//     server:app.server
// });

// app.wss.on("connection",(ws) => {
//     console.log("New Client connected")
// })

const WebSocketServer = require("uws").Server;

const x = WebSocketServer




app.server.listen(port,() => {
    console.log(`app is running on port ${port}`) 
})

module.exports =  index;