const app = require("express")();

const server = app.listen(12321, () => {
  console.log("서버 실행");
});

const SocketIO = require("socket.io");

const io = SocketIO(server, { path: "/socket.io", cors: { origin: "*" } });

const { joinRoom, leaveRoom, getRoomInfo } = require("./room")(io);
const { getItemPoint } = require("./items")(io);
const { getMousePoint } = require("./mouse")(io);
const { updateImage } = require("./image")(io);
const { getCatPoint } = require("./cat")(io);
const { itemMotion } = require("./items")(io);

app.get("/", (req, res) => {
  res.send("live");
});

const onConnection = (socket) => {
  socket.currentRoom = "";

  console.log("접속 socket.id : ", socket.id);

  socket.on("disconnect", function () {
    console.log("클라이언트 접속 해제", socket.id);
    const tempFnc = leaveRoom.bind(this);
    tempFnc();
    clearInterval(socket.interval);
  });

  // room 나갈 때
  socket.on("leave-room", leaveRoom);

  //  에러 발생할 때
  socket.on("error", (error) => {
    console.error(error);
  });

  // room
  socket.on("join-room", joinRoom);

  // room 입장정보 전달
  socket.on("get-room-info", getRoomInfo);

  // 마우스 좌표
  socket.on("get-mouse-point", getMousePoint);

  socket.on("get-cat-point", getCatPoint);

  socket.on("get-item-point", getItemPoint);

  // 이미지 수신 (클라이언트에게서 이미지 받기)
  socket.on("update-image", updateImage);

  socket.on("give-motion-info", itemMotion);

  // event log
  var onevent = socket.onevent;
  socket.onevent = function (packet) {
    var args = packet.data || [];
    onevent.call(this, packet); // original call
    packet.data = ["*"].concat(args);
    onevent.call(this, packet); // additional call to catch-all
  };

  const notLogging = ["get-mouse-point", "get-cat-point"];
  socket.on("*", function (event, data) {
    if (notLogging.includes(event)) {
      return;
    }
    console.log(event, data);
  });
};

io.on("connection", onConnection);
