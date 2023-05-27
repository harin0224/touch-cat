const app = require("express")();
const localtunnel = require("localtunnel");

const server = app.listen(12321, () => {
  console.log("서버 실행");
});

const SocketIO = require("socket.io");

const io = SocketIO(server, { path: "/socket.io" });

const { joinRoom, leaveRoom, getRoomInfo } = require("./room")(io);
const { getItemPoint } = require("./items")(io);
const { getMousePoint } = require("./mouse")(io);
const { updateImage } = require("./image")(io);
const { getCatPoint } = require("./cat")(io);

app.get("/", (req, res) => {
  res.send("live");
});

const onConnection = (socket) => {
  socket.currentRoom = "";

  // 연결 2명
  // socket1.rooms = [] socket2.rooms = []
  // socket1.rooms.push('dsd') -> ['dsd']  socket2.rooms = []
  console.log("접속 socket.id : ", socket.id);

  //연결 종료할 때

  // socket.on("test1", () => {});
  // socket.on("test1", function () {});

  socket.on("disconnect", function () {
    console.log("클라이언트 접속 해제", socket.id);
    //leaveRoom(socket); // <--- this socket ???

    /* 
      1. this 가 socket 을 바라보고 있지 않는경우 
      2. .bind(this)가 this를 설정하는게 아닌 경우  ----> 검색해서 틀렸을 가능성이 매우적어
    */

    /* 
        () => { }

        function () {}
      */

    /* 
        사용할때마다 달라지는것 ---> xxxxx
        사용되는 범위 (즉 함수 라던가 class 라던가 )마다 달라지는것
      */
    const tempFnc = leaveRoom.bind(this);
    tempFnc();
    /* 
      const tempFnc = leaveRoom.bind(this);
      tempFnc();

      function TempClass() {

        function a() {
          this <<---- TempClass
        }
      }
      const a = new TempClass();
      a.a()


     */
    clearInterval(socket.interval);
  });
  /* 
  function socket () {
    function on(key, callback) {
      callback() <---- this  === socket
    }
  }
  */

  //room 나갈 때
  socket.on("leave-room", leaveRoom);

  //에러 발생할 때
  socket.on("error", (error) => {
    console.error(error);
  });

  //room
  socket.on("join-room", joinRoom);

  //room 입장정보 전달
  socket.on("get-room-info", getRoomInfo);

  //마우스 좌표
  socket.on("get-mouse-point", getMousePoint);

  socket.on("get-cat-point", getCatPoint);

  socket.on("get-item-point", getItemPoint);

  //이미지 수신 (클라이언트에게서 이미지 받기)
  socket.on("update-image", updateImage);

  // //이미지 발신 (room 사람들에게 이미지 보내기)
  // socket.on("send-image", (data) => {
  //   io.to(socket.currentRoom).emit("give-image", data);
  // });
};

io.on("connection", onConnection);

/*
  const 날씨 = await getWeather(); 비동기 1초
  console.log('날씨 : ' ,날씨) --> undefinded
  이 코드를 당장 실행시켜야하는데요? 함수면 어떻게 바로 불러오죠?

  --->

  그래서 나온 해결책
  (async function a() {
    const 날씨 = await getWeather(); 비동기 1초
    console.log('날씨 : ' ,날씨) --> undefinded
  })()
    <--- 옛날방식

    ----> 최신 방식
    arrow function 
    () => {}
    (async () => {})()
*/

(async () => {
  // await delay(1000);
  const tunnel = await localtunnel({ port: 12321, subdomain: "touch-cat" });

  // await localtunnel({ port: 12321, subdomain: "touch-cat" });
  console.log(tunnel.url);

  tunnel.on("close", () => {
    // tunnels are closed//
    console.log("server closed");
  });
})();

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
