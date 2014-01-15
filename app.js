var express = require('express'),
    app = express();
    swig = require('swig'),
    http = require('http'),
    server = require("http").createServer(app), 
    io = require("socket.io").listen(server);
   
global.user_list = []; 

var index = require("./route/index");

swig.setDefaults({"cache": false});

app.configure(function(){
  app.engine('html', swig.renderFile);
  app.set('view engine', 'html');
  app.set('view cache', false);
  app.set('views', __dirname + '/views');
  app.use('/public', express.static(__dirname + "/public"));
  app.use(express.cookieParser());
  app.use(express.session({secret: '0000'}));
  app.use(express.bodyParser());
})

server.listen(3000);
console.dir("Start listen 3000 port");

app.all("/", index.login);
app.all("/chat", index.index);

io.sockets.on('connection', function(socket){
  socket.on('client_msg', function(data){
    io.sockets.emit("server_msg", {"msg":data.msg, "name":data.name});
  });
  
  socket.on('client_user', function(user){
    socket.user = user.name;
    user_list.push({"name": user.name, "id":socket.id});
    io.sockets.emit("Users", {"ar":user_list, "name": user.name ,"status": "已登入"});
  });
  
  socket.on('disconnect', function () {
    if(socket.user && socket.id){
      for(var idx in user_list){
        var user = user_list[idx];
        if(socket.user == user.name && socket.id == user.id){
          var position = user_list.indexOf(user);
          if ( ~position ){
            user_list.splice(position, 1);
          }
          io.sockets.emit("Users", {"ar":user_list, "name":user.name, "status": "已登出"});
          break;
        }
      }
    }
  });
});
