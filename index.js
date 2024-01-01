// index.js
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRouter = require("./routes/userRouter");
const messagesRouter = require("./routes/messagesRouter")
const app = express()
// middleware
app.use(express.json()) // Uncomment this line to enable JSON parsing
app.use(cors({
  origin: process.env.FRONT_END_PORT,
}));

const mongoServer = mongoose.connect(process.env.MONGOOSE_URL)
.then(() => {

  console.log("DB connected");

})
.catch((err) => {
  console.error("DB connection error:", err);
});

app.use("/api/auth", userRouter);
app.use("/api/messages",messagesRouter)
const appServer =   app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});


let users = []


const addUser = (userId, socketId) => {
  if(userId){
    !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
  }

};


const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
const io = require("socket.io")(appServer, {
  cors: {
    origin: process.env.FRONT_END_PORT,
  },
});
io.on('connection',(socket)=>{
  console.log('a user connected')
  socket.on('addUser',(userId)=>{
console.log(userId,"see uerid")

addUser(userId,socket.id)

io.emit('getUsers',users)

  })
  socket.on("disconnect",()=>{console.log("users disconnected")
  removeUser(socket.id)
io.emit('getUsers',users)
})


socket.on("send-msg", ({to,from,msg}) => {
  console.log(msg)
  const user = getUser(to);
  console.log(user,"identified")
  io.to(user?.socketId).emit("msg-recieve", {
    from,
    msg
  });
});
})