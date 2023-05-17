module.exports = (io) => {
  const getImage = function (data) {};

  const updateImage = function (data) {
    const socket = this;
    /* 
      {
        key1:value1,
        key2:val2,
      }
    */

    const { image, uid } = data; //  same == const key1 = data.key1
    socket.broadcast
      .to(socket.currentRoom)
      .emit("update-image", { image, uid });
  };

  return {
    updateImage,
  };
};
