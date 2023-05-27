// module.exports -> 외부에서도 해당 파일에 있는 코드를 사용할 수 있게 내보내겠습니다. 라는 의미
module.exports = (io) => {
  const rooms = {};

  /* 
  1. key : value 데이터 저장
  2. 배열인데 object 배열형태로저장

  1 ex) {
    'roomCode1':{
      nickName:'dokbawi'
    }
  }

  rooms[socket.currentRoom] = {n: }

  2 ex) [
    {
      roomCode : 'roomCode',
      nickname:'dokbawi'
    }
  ]
  */

  const joinRoom = function (data) {
    /*
      주의점 !!! 화살표함수 즉 => {} 얘는 this가 socket이 아니다. 
      const joinRoom = (data) => {} <---- xxxxxxx
      const joinRoom = function (data) {} <----- ooooo
     */
    const socket = this;

    const { roomCode, nickName } = data;
    console.log(`room code : ${roomCode}`);

    //방 만들기 및 입장

    /* 
      room = {}
      room[roomCode] = {} 
    */

    socket.currentRoom = roomCode;

    //입장 시 닉네임 설정
    socket.nickName = nickName;

    rooms = roomInfo(rooms, data);

    socket.broadcast
      .to(socket.currentRoom)
      .emit("alert", `${nickName}님이 방에 입장했습니다.`);
  };

  const leaveRoom = function (data) {
    const socket = this;
    socket.leave(socket.currentRoom);
    socket.broadcast
      .to(socket.currentRoom)
      .emit("alert", `${socket.nickName}님이 나갔습니다.`);
    socket.currentRoom = "";
  };

  function roomInfo(rooms, data) {
    // A 가 있으면 A 없으면 [] 로 값을 넣음
    // A.push() <--- A가 배열인지 아닌지 모르는상태
    // console.log(rooms)---> {}
    // rooms[socket.roomCode] --> undefinded --> []
    const { nickName, uid, image, roomCode } = data;
    rooms[roomCode] = rooms[roomCode] | [];
    rooms[roomCode].push({ nickName, uid, image });

    return rooms;
  }

  const getRoomInfo = function (data) {
    const socket = this;
    socket.emit("get-room-Info", rooms);
  };

  return {
    joinRoom,
    leaveRoom,
    getRoomInfo,
  };
};
