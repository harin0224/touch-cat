module.exports = (io) => {
  const getItemPoint = function (data) {
    const socket = this;

    const { x, y, nickName } = data;
    socket.broadcast
      .to(socket.currentRoom)
      .emit("give-item-point", { x, y, nickName });
  };

  const itemMotion = function (data) {
    const socket = this;
    socket.broadcast.to(socket.currentRoom).emit("give-motion-info", data);
  };

  return {
    getItemPoint,
    itemMotion,
  };
};
