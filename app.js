const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const { ExpressPeerServer } = require("peer");

const connectDB = require("./config/db");
const psychiatrist = require("./routes/psychiatrist/psychiatrist");
const users = require("./routes/users/user");
const userAppointment = require("./routes/users/user-appointment/userAppointment");
const task = require("./routes/Task/task");
const article = require("./routes/article/article");
const room = require("./routes/chat-room/room");
const psychProfile = require("./routes/psychiatrist/psychProfile");
const video_chat = require("./routes/video-chat/video_chat");
const psychSocial = require("./routes/psychiatrist/psychSocial");
const psychSchedule = require("./routes/psychiatrist/psychSchedule");
const auth = require("./routes/psychiatrist/auth");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
// io.set("transports", ["websocket", "flashsocket", "polling"]);
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
const port = 5000 || Proccess.env.PORT;

app.use(express.json({ extended: false }));
app.use("/peerjs", peerServer);
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Credentials", true);

//   res.header("Access-Control-Allow-Orgin", "http://localhost:3000");

//   res.header("Access-Control-Allow-Methods", "OPTIONS,GET,PUT,POST,DELETE");

//   res.header(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,X-HTTP-Method-Override, Content-Type,Accept, X-XSRF-TOKEN"
//   );

//   next();
// });

connectDB();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/vp/psychiatrist", psychiatrist);
app.use("/vp/users", users);
app.use("/vp/user/appointment",userAppointment);
app.use("/vp/psychiatrist/auth", auth);
app.use("/vp/task", task);
app.use("/vp/article", article);
app.use("/vp/room", room);
app.use("/vp/psych/profile", psychProfile);
app.use("/vp/psych/schedule",psychSchedule);
app.use("/vp/videochat", video_chat);
app.use("/vp/psych/social", psychSocial);

const weclomeMessage = "Welcome to virtual-psychiatrist chat room.";

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
  });
});

const videoChatText = io.of("/vct");
videoChatText.on("connection", (socket) => {
  socket.on("message", (messageInfo) => {
    console.log(messageInfo.textMsg);
    io.to(messageInfo.room).emit("newMessage", messageInfo.textMsg);
  });
});

videoChatText.on("disconnect", () => {
  console.log("User Diconnected");
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

// io.on("connection",(socket) => {
//   socket.on("join",(roomName) => {
//     socket.join(roomName);
//   })
//   socket.on("joinUser",(user) => {
//     socket.join(user);
//   })
//   socket.on("sendMessage",(message) => {
//     io.to(message.room).emit("message",message.text)
//   })
// })

// io.on("connection",(socket) => {
//   socket.on("join-room",(roomId,userId) => {
//     socket.join(roomId);
//     socket.to(roomId).broadcast.emit("user-connected",userId)
//   })
// })

// io.on("connection", (socket) => {
//   socket.on("join", (roomName) => {
//     console.log(`A user has joined ${roomName}`);
//     socket.join(roomName);
//     socket.emit("message", weclomeMessage);
//     socket.broadcast.to(roomName).emit("message", `A user has joined`);
//   });

//   socket.on("joinUser",(user) => {
//     console.log(`user ${user}`);
//     socket.join(user);
//     socket.emit("message","user chat started...");

//   })

//   socket.on("send", (message) => {
//     io.to(message.room).emit("message", message.text);
//   });
// });


