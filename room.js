module.exports = (io) => {
  let rooms = {};
  global.rooms = rooms;

  const joinRoom = function (data) {
    const socket = this;

    const { roomCode, nickName } = data;

    // 방 만들기 및 입장
    socket.join(roomCode);

    socket.currentRoom = roomCode;

    // 입장 시 닉네임 설정
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
    const { nickName, image, roomCode } = data;
    rooms[roomCode] = rooms[roomCode] || [];
    rooms[roomCode].push({ nickName, image });

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
