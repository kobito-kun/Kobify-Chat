const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const {v4} = require("uuid");

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');  
});

var users = [];

io.on('connection', (socket) => {

  // sending stuff functions: //

  const sendMessage = (action, id, user, message) => {
    io.emit('message', {
      "action": action,
      "id": id,
      "user": user,
      "message": message
    })
  }
  
  const sendUsersOnline = () => {
    io.emit('users_online', {
      "users": users
    })
  }

  const sendUserActivity = (joined) => {
    io.emit('user_activity', {
      "user": String(socket.id),
      "joined": joined
    })
  }  

  const sendInitialData = () => {
    io.emit('initial_data', {
      "user": String(socket.id)
    })
  }

  const userManagement = bool => {
    if(bool){
      users.push(String(socket.id))
    }else{
      var output = []
      users.forEach(item => {
        if(item !== String(socket.id)){
          output.push(item)
        }
      })
      users = output
    }
  }

  // end functions //

  // initial functions //

  userManagement(true)
  sendUsersOnline()
  sendUserActivity(true)
  sendInitialData()
  
  // end intial functions //
  
  // final functions // 

  socket.on('disconnect', () => {
    userManagement(false)
    sendUsersOnline()
    sendUserActivity(false)
  })

  // end final functions

  // trigger / events //

  socket.on('message', object => {
    const {action, id, user, message} = object
    sendMessage(action, id, user, message)
  })

  // end trigger / events //

});

http.listen(3000, () => console.log("Listening"));