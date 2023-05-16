module.exports = (io) => {
  const getMousePoint = function (data) {
    const socket = this;

    const { x, y, nickName } = data;
    socket.broadcast
      .to(socket.currentRoom)
      .emit("give-point", { x, y, nickName });
  };

  return {
    getMousePoint,
  };
};
