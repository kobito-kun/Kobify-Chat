const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const {v4} = require("uuid");

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');  
});

var users = [];

io.on('connection', (socket) => {

  users.push(socket.id)

  io.emit('users_online', {
    "users": users
  })

  io.emit('connected_initial_message', {
    "user_id": String(socket.id)
  });

  io.emit("user_activity", {
    "user": String(socket.id),
    "joined": true
  })

  socket.on('disconnect', () => {
    users = users.filter(user => user !== socket.id)
    console.log(users)
    io.emit("users_online", {"users": users})
    io.emit("user_activity", {"user": String(socket.id), "joined": false})
  })

  socket.on('message', object => {
    const {action, id, user, message} = object
    if(action === "add"){ 
      io.emit('message', {
        "action": "add",
        "id": v4(),
        "user": user,
        "message": message
      })
    }else if(action === "delete"){
      io.emit('message', {
        "action": "delete",
        "id": id,
        "user": user,
        "message": null,
      })
    }else if(action === "edit"){
      io.emit('message', {
        "action": "edit",
        "id": id,
        "user": user,
        "message": message
      })
    }else{
      console.log("Error...")
    }
  })
});

http.listen(3000, () => console.log("Listening"));