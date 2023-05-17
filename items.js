module.exports = (io) => {
  const getItemPoint = function (data) {
    const socket = this;

    const { x, y, nickName } = data;
    socket.broadcast
      .to(socket.currentRoom)
      .emit("give-item-point", { x, y, nickName });
  };

  return {
    getItemPoint,
  };
};
