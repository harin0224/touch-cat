module.exports = (io) => {
  const getCatPoint = function (data) {
    const socket = this;

    const { x, y, nickName } = data;
    socket.broadcast
      .to(socket.currentRoom)
      .emit("give-cat-point", { x, y, nickName });
  };

  return {
    getCatPoint,
  };
};
