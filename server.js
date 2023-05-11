const app = require("express")();
const server = app.listen(8005, () => {
  console.log("서버 실행");
});

const SocketIO = require("socket.io");

const io = SocketIO(server, { path: "/socket.io" });

function leaveRoom(socket) {
  for (const roomCode of socket.roomList) {
    socket.leave(roomCode);
    socket.broadcast
      .to(roomCode)
      .emit("alert", `${socket.nickName}님이 나갔습니다.`);
    socket.currentRoom = "";
  }
}

io.on("connection", (socket) => {
  socket.currentRoom = "";

  //연결 종료할 때
  socket.on("disconnect", () => {
    console.log("클라이언트 접속 해제", ip, socket.id);
    leaveRoom(socket);
    clearInterval(socket.interval);
  });

  //room 나갈 때
  socket.on("leave-room", (data) => {
    leaveRoom(socket);
  });

  //에러 발생할 때
  socket.on("error", (error) => {
    console.error(error);
  });
  //room
  socket.on("join-room", (data) => {
    const { roomCode, nickName } = data;
    console.log(`room code : ${roomCode}`);

    //방 입장
    socket.join(roomCode);
    socket.roomList.push(roomCode);

    //입장 시 닉네임 설정
    socket.nickName = nickName;

    io.to(roomCode).emit("alert", `${nickName}님이 입장했습니다.`);
  });

  //마우스 좌표
  socket.on("get-mouse-point", (data) => {
    const { x, y, nickName } = data;
    io.to(currentRoom).emit("give-point", { x, y, nickName });
  });
});
