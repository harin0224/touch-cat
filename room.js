// module.exports -> 외부에서도 해당 파일에 있는 코드를 사용할 수 있게 내보내겠습니다. 라는 의미
module.exports = (io) => {
  let rooms = {};

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
    //console.log(`room code : ${roomCode}`);

    //방 만들기 및 입장
    socket.join(roomCode);
    /* 
      room = {}
      room[roomCode] = {} 
    */

    socket.currentRoom = roomCode;

    //입장 시 닉네임 설정
    socket.nickName = nickName;

    rooms = roomInfo(rooms, data);

    const result = {
      type: "join-room",
      data: { nickName: socket.nickName },
    };

    socket.broadcast.to(socket.currentRoom).emit("alert", result);
  };

  const leaveRoom = function (data) {
    const socket = this;

    if (!socket.currentRoom) {
      return;
    }

    socket.leave(socket.currentRoom);
    const result = {
      type: "leave-   room",
      data: { nickName: socket.nickName },
    };

    socket.broadcast.to(socket.currentRoom).emit("alert", result);
    // 나간 사람 삭제
    rooms[socket.currentRoom] = rooms[socket.currentRoom]?.filter(
      (param) => param.nickName != socket.nickName
    );

    // 빈 방 삭제
    if (rooms[socket.currentRoom].length === 0) {
      delete rooms[socket.currentRoom];
    }

    socket.currentRoom = "";
  };

  function roomInfo(rooms, data) {
    // A 가 있으면 A 없으면 [] 로 값을 넣음
    // A.push() <--- A가 배열인지 아닌지 모르는상태
    // console.log(rooms)---> {}
    // rooms[socket.roomCode] --> undefinded --> []
    const { nickName, image, roomCode } = data;

    //console.log(`data : ${JSON.stringify(data)}`);
    //console.log("1 : ", rooms);
    rooms[roomCode] = rooms[roomCode] || [];
    //console.log("2 : ", rooms);
    rooms[roomCode].push({ nickName, image });

    //   rooms:{
    //       "123": [{nickName: "", image: "png"}]
    // }

    return rooms;
  }

  const getRoomInfo = function (data) {
    const socket = this;
    socket.emit("get-room-info", rooms[socket.currentRoom]);
  };

  return {
    joinRoom,
    leaveRoom,
    getRoomInfo,
  };
};
