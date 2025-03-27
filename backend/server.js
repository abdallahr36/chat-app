require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const authRoutes = require("./routes/auth");
const { verifyTokenSocket } = require("./middleware/authMiddleware");
const Message = require("./models/Message");


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

io.use(verifyTokenSocket).on("connection", (socket) => {
  console.log("New user connected:", socket.userId);

  socket.join("global");

  Message.find().sort({ timestamp: 1 }).limit(50).then((messages) => {
    socket.emit("chat history", messages);
  });
  

  socket.on("chat message", async (msg) => {
    console.log("Message received on backend:", msg);
  
    const savedMessage = new Message({
      username: msg.username,
      text: msg.text,
    });
  
    await savedMessage.save();
  
    io.to("global").emit("chat message", msg);
  });
  

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);
  });
});

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
