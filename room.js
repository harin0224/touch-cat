// module.exports -> 외부에서도 해당 파일에 있는 코드를 사용할 수 있게 내보내겠습니다. 라는 의미
module.exports = (io) => {
  const joinRoom = function (data) {
    /*
      주의점 !!! 화살표함수 즉 => {} 얘는 this가 socket이 아니다. 
      const joinRoom = (data) => {} <---- xxxxxxx
      const joinRoom = function (data) {} <----- ooooo
     */
    const socket = this;

    const { roomCode, nickName } = data;
    console.log(`room code : ${roomCode}`);

    //방 입장
    socket.join(roomCode);
    socket.currentRoom = roomCode;

    //입장 시 닉네임 설정
    socket.nickName = nickName;

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

  return {
    joinRoom,
    leaveRoom,
  };
};
