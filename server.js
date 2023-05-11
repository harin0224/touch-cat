const app = require("express")();

const server = app.listen(8005, () => {
  console.log("서버 실행");
});

const SocketIO = require("socket.io");

const io = SocketIO(server, { path: "/socket.io" });

const { joinRoom } = require("./room")(io);
const { getMousePoint } = require("./mouse")(io);
const { updateImage } = require("./image")(io);

const onConnection = (socket) => {
  socket.currentRoom = "";
  console.log("접속 socket.id : ", socket.id);
  socket.on("temp", tempFunction);

  //연결 종료할 때
  socket.on("disconnect", () => {
    console.log("클라이언트 접속 해제", socket.id);
    leaveRoom(socket);
    clearInterval(socket.interval);
  });

  //room 나갈 때
  socket.on("leave-room", leaveRoom);

  //에러 발생할 때
  socket.on("error", (error) => {
    console.error(error);
  });

  //room
  socket.on("join-room", joinRoom);

  //마우스 좌표
  socket.on("get-mouse-point", getMousePoint);

  //이미지 수신 (클라이언트에게서 이미지 받기)
  socket.on("update-image", updateImage);

  // //이미지 발신 (room 사람들에게 이미지 보내기)
  // socket.on("send-image", (data) => {
  //   io.to(socket.currentRoom).emit("give-image", data);
  // });
};

io.on("connection", onConnection);
