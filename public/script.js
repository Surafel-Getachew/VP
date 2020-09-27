// const socket = io("/");
// const videoGrid = document.getElementById("video-grid");
// const myVideo = document.createElement("video");
// myVideo.muted = true;
// let myVideoStream;

// var peer = new Peer(undefined, {
//   path: "/peerjs",
//   host: "/",
//   port: "8000",
// });

// navigator.mediaDevices
//   .getUserMedia({
//     video: true,
//     audio: true, // all this things request the user medial vid and aud
//   })
//   .then((stream) => {
//     myVideoStream = stream;
//     addVideoStream(myVideo, stream);
//     peer.on("call", (call) => {
//       call.answer(stream);
//       const video = document.createElement("video");
//       call.on("stream", (userVideoStream) => {
//         addVideoStream(video, userVideoStream);
//       });
//     });
//     socket.on("user-connected", (userId) => {
//       connectToNewUser(userId, stream);
//     });
//   });

// peer.on("open", (id) => {
//   socket.emit("join-room", ROOM_ID, id);
// });

// const connectToNewUser = (userId, stream) => {
//   const call = peer.call(userId, stream);
//   const video = document.createElement("video");
//   call.on("stream", (userVideoStream) => {
//     addVideoStream(video, userVideoStream);
//   });
// };

// const addVideoStream = (video, stream) => {
//   video.srcObject = stream;
//   video.addEventListener("loadedmetadata", () => {
//     video.play();
//   });
//   videoGrid.append(video);
// };

// const text = $("input");

// $("html").keydown((e) => {
//   if (e.which == 13 && text.val().length !== 0) {
//     socket.emit("message", text.val()); //check if e.value has a value of enter
//     text.val("");
//   }
// });

// socket.on("createMessage", (message) => {
//   $(".messages").append(`<li class="message"><b>user</b><br/>${message}</li>`);
//   scrollToBottom();
// });

// const scrollToBottom = () => {
//   let d = $(".main_chat_window");
//   d.scrollTop(d.prop("scrollHeight"));
// };

// // Mute video
// const muteUnmute = () => {
//   const enabled = myVideoStream.getAudioTracks()[0].enabled;
//   if (enabled) {
//     myVideoStream.getAudioTracks()[0].enabled = false;
//     setUnmuteButton();
//   } else {
//     setMuteButton();
//     myVideoStream.getAudioTracks()[0].enabled = true;
//   }
// };

// const setMuteButton = () => {
//   const html = `<i class = "fas fa-microphone"> </i>
//         <span> Mute <span>
//     `;
//   document.querySelector(".main__mute_button").innerHTML = html;
// };
// const setUnmuteButton = () => {
//   const html = `<i class = "unmute fas fa-microphone-slash"> </i>
//         <span> Unmute <span>
//     `;
//   document.querySelector(".main__mute_button").innerHTML = html;
// };

// // PLAY STOP VIDEO

// const playStop = () => {
//   let enabled = myVideoStream.getVideoTracks()[0].enabled;
//   if (enabled) {
//     myVideoStream.getVideoTracks()[0].enabled = false;
//     setPlayVideo();
//   } else {
//     setStopVideo();
//     myVideoStream.getVideoTracks()[0].enabled = true;
//   }
// };

// const setStopVideo = () => {
//   const html = `<i class ="fas fa-video"> </i>
//     <span> Stop Video <span>
// `;
//   document.querySelector(".main__video_button").innerHTML = html;
// };
// const setPlayVideo = () => {
//   const html = `<i class = "stop fas fa-video-slash"> </i>
//     <span> Play Video <span>
// `;
//   document.querySelector(".main__video_button").innerHTML = html;
// };
