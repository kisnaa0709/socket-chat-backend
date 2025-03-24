require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("register", async (email) => {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email, userId: socket.id });
    }

    socket.emit("registered", user);
  });

  socket.on("sendMessage", async (data) => {
    const { senderId, receiverId, message, groupId } = data;
    const newMessage = await Message.create({ senderId, receiverId, groupId, message });

    if (groupId) {
      io.to(groupId).emit("receiveMessage", newMessage);
    } else {
      io.to(receiverId).emit("receiveMessage", newMessage);
    }
  });

  socket.on("createGroup", async (groupName, members) => {
    const group = await Group.create({ name: groupName, members });

    members.forEach((member) => {
      io.to(member).emit("groupCreated", group);
    });
  });

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
