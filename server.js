const express = require("express");
const app = express();
const socket = require("socket.io");
const { v4: uuidV4 } = require("uuid");
const cors = require("cors");
const path = require("path");

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log("server running on -", PORT);
});

app.use(cors());
var io = socket(server);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });
  });
});
