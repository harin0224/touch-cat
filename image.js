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
    // socket.currentRoom = "123123";
    // rooms = {
    //   123123: [
    //     { nickName: "nick", image: "img.png" },
    //     { nickName: "name", image: "png.png" },
    //   ],
    // };

    const { image, nickName } = data; //  same == const key1 = data.key1
    if (!rooms) {
      return;
    }
    for (let i = 0; i < rooms[socket.currentRoom].length; i++) {
      // console.log(
      //   "값1:",
      //   rooms[socket.currentRoom][i].nickName,
      //   "값2:",
      //   nickName
      // );
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

    // console.log("룸:", rooms);
  };

  return {
    updateImage,
  };
};
