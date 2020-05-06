const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const connectDB = require("./config/db");
const psychiatrist = require("./routes/psychiatrist/psychiatrist");
const users = require("./routes/users/user");
const task = require("./routes/Task/task");
const article = require("./routes/article/article");
const room = require("./routes/chat-room/room");
const psychProfile = require("./routes/psychiatrist/PsychProfile");
const auth = require("./routes/psychiatrist/auth");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = 5000||Proccess.env.PORT;

app.use(express.json({ extended: false }));

connectDB();

app.use((req,res,next) => {

  res.header("Access-Control-Allow-Credentials",true);

  res.header("Access-Control-Allow-Orgin","http://localhost:3000")

  res.header("Access-Control-Allow-Methods","OPTIONS,GET,PUT,POST,DELETE");

  res.header("Access-Control-Allow-Headers","X-Requested-With,X-HTTP-Method-Override, Content-Type,Accept, X-XSRF-TOKEN")

    next();
});

app.use("/vp/psychiatrist", psychiatrist);
app.use("/vp/users", users);
app.use("/vp/psychiatrist/auth", auth);
app.use("/vp/task", task);
app.use("/vp/article",article);
app.use("/vp/room",room);
app.use("/vp/psychProfile",psychProfile);


io.on("connection", (socket) => {
  console.log("socket test success")
})




server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

