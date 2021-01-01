const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const { ExpressPeerServer } = require("peer");

const connectDB = require("./config/db");
const psychiatrist = require("./routes/psychiatrist/psychiatrist");
const users = require("./routes/users/user");
const message = require("./routes/message/message");
const userAppointment = require("./routes/users/user-appointment/userAppointment");
const userProfile = require("./routes/users/user-profile/userProfile")
const task = require("./routes/Task/task");
const article = require("./routes/article/article");
const room = require("./routes/chat-room/room");
const psychProfile = require("./routes/psychiatrist/psychProfile");
const video_chat = require("./routes/video-chat/video_chat");
const psychSocial = require("./routes/psychiatrist/psychSocial");
const psychSchedule = require("./routes/psychiatrist/psychSchedule");
const groupVideoChat = require("./routes/group-video-chat/groupVideoChat");
const psychAppointment = require("./routes/psychiatrist/psychAppointment");
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
app.use("/vp/user/profile",userProfile);
app.use("/vp/psychiatrist/auth", auth);
app.use("/vp/task", task);
app.use("/vp/article", article);
app.use("/vp/groupVideoChat", groupVideoChat);
app.use("/vp/psych/message",message)
app.use("/vp/room", room);
app.use("/vp/psych/profile", psychProfile);
app.use("/vp/psych/schedule",psychSchedule);
app.use("/vp/videochat", video_chat);
app.use("/vp/psych/social", psychSocial);
app.use("/vp/psych/appointment",psychAppointment);
const weclomeMessage = "Welcome to virtual-psychiatrist chat room.";



// THis is the start of the video call code
let clients = []

io.on("connection",socket => {

  socket.on("storeClientInfo",(data) => {
    const clientInfo = {};
    clientInfo.customId = data.customId
    clientInfo.socketId = socket.id
    clients.push(clientInfo);
  });

  

  socket.on("callUser",(id,caller) => {
    for(let i=0; i<clients.length; i++) {
      if (clients[i].customId === id) {
        socket.to(clients[i].socketId).emit("reciveeCall",caller);
        console.log("user to call founddd, calling user",clients[i].socketId);
        console.log("user to call founddd, calling user",clients[i].clientId);
        break;
      } else {
        console.log("User is not online");
        // here emit user is offline event
      }
    }
  })

  socket.on("sendMessage",(sender,reciver,message) => {
    for(let i=0; i<clients.length; i++){
      if (clients[i].customId === reciver) {
        socket.to(clients[i].socketId).emit("msg",message,sender);
        break;
      }
    }
    
  })
 
  socket.on("videoCall",(userToCall,userId) => {
    console.log("video calling user....");
    for (let i=0; i < clients.length; i++) {
      if (clients[i].customId === userToCall) {
        console.log("user to call found",clients[i].customId);
        socket.to(clients[i].socketId).emit("user-connected",userId)
        break;
      } else {
        console.log("user is offline");
      }
    }
    // socket.join(userToCall);
    // socket.to(userToCall).broadcast.emit("user-connected", userId);
  })
  
  socket.on("disconnect",(data) => {
    for(let i=0; i<clients.length; i++) {
      if (clients[i].socketId == socket.id) {
        break;
      }
    }
  })
 
});

const videocall = io.of("/videocall");

videocall.on("connection",socket => {
    socket.on("join-room",(roomId,peerId) => {
      console.log("roomId",roomId);
        socket.join(roomId);
        // socket.to(roomId).broadcast.emit("user-connected", peerId,myName);
        socket.to(roomId).broadcast.emit("user-connected", peerId);
        socket.on("myNameee",namee => {
          console.log(namee,"JOINED");
          socket.to(roomId).broadcast.emit("otherrPeerName",namee)
        })
      })
      socket.on("sendTxtMessage",(msg,roomIdd,sender) => {
        videocall.to(roomIdd).emit("newMessage",msg,sender);
      })
      socket.on("declineCall",(roomId) => {
        videocall.to(roomId).emit("callDeclined")
      })
      socket.on('disconnect', function () {
     
  }); 
})

//               THis is the end of video call code

// io.on("connection",socket => {
//   console.log("connection is established");
//   socket.on("opencheck",data => {
//     console.log(data);
//   })
//   socket.on("someOneCalling",id => {
//     // io.to(id).emit("ring",id);
//     console.log("someOne is calling",id);
//     io.emit("ring",id);
//   })
//   socket.on("emitCheck",data => {
//     console.log(data);
//   })
//   socket.on('disconnect', () => {
//     delete users[socket.id];
// })

// socket.on("callUser", (data) => {
//     io.emit('hey', {signal: data.signalData});
// })

// socket.on("acceptCall", (data) => {
//   io.emit('callAccepted', data.signal);
//     // io.to(data.to).emit('callAccepted', data.signal);
// })
// });
// io.on("connection",socket => {
//   if (!userss[socket.id]) {
//     userss[socket.id] = socket.id;
//   }
//   socket.emit("yourId",socket.id);
//   io.sockets.emit("allUsers",userss);
//   socket.on("disconnect",() => {
//     delete userss[socket.id]
//   })
//   socket.on("callUser",(data) => {
//     io.to(data.userToCall).emit("hey",{signal:data.signalData,from:data.from})
//   });
//   socket.on("acceptCall",(data) => {
//     io.to(data.to).emit("callAccepted",data.signal)
//   })
// })


//                   This was the working code for the previous video chat                   //
// io.on("connection", (socket) => {
//   console.log("connected");
//   socket.on("join-room", (roomId, userId) => {
//     console.log("id of the room",roomId);
//     socket.join(roomId);
//     socket.to(roomId).broadcast.emit("user-connected", userId);
//   });
//   socket.on("disconnect",() => {
//     console.log("Disconnected");
//   })
// });

// io.on("connection",(socket) => {
//   console.log("connected");

//   socket.on("join-room",(roomId,id) => {
//       console.log("user joined room:",roomId);
//       socket.join(roomId);
//       socket.to(roomId).broadcast.emit("user-connected", id);
//   })

//   socket.on("check",msg => {
//       console.log(msg);
//   })
//   socket.on("disconnect",() => {
//       console.log("disconnected")
//   })
// })

// const videoChatText = io.of("/vct");
// videoChatText.on("connection", (socket) => {
//   socket.on("message", (messageInfo) => {
//     console.log(messageInfo.textMsg);
//     io.to(messageInfo.room).emit("newMessage", messageInfo.textMsg);
//   });
// });

// videoChatText.on("disconnect", () => {
//   console.log("User Diconnected");
// });

//                uncomment until this                                                // 

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


