module.exports = (io) => {
  const updateImage = function (data) {
    const socket = this;

    const { image, nickName } = data;
    if (!rooms) {
      return;
    }
    for (let i = 0; i < rooms[socket.currentRoom].length; i++) {
      if (rooms[socket.currentRoom][i].nickName === nickName) {
        rooms[socket.currentRoom][i].image = image;

        break;
      }
    }

    socket.broadcast.to(socket.currentRoom).emit("alert", {
      type: `update-image`,
      nickName,
      image,
    });
  };

  return {
    updateImage,
  };
};
