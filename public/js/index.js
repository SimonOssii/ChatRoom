$(document).ready(function(){
  var socket = io.connect('http://localhost:3000');
  var name = $("#wel_name").attr("data-name");
  
  if(name){
    socket.emit('client_user', {"name":name});
  }
  
  // append User and User login msg
  socket.on("Users", function(data){
    var scroll_pos = $(".chat_area").prop('scrollHeight');
    $(".chat_area").append("<p class='login_msg'>"+data.name + data.status +"</p>");
    $(".chat_area").animate({ scrollTop: scroll_pos }, "fast");
    $(".users_list").empty();
    for(var idx in data.ar){
      var user = data.ar[parseInt(idx)];
      $(".users_list").append("<li id="+user.id+" class='user_li'>"+ user.name+"</li>");
    }
  })
  
  // Click event
  $(".send").bind('click', function(){
    var msg = $(".msg_area").val();
    if(msg != ""){
      socket.emit('client_msg', {"msg":msg, "name":name});
      $(".msg_area").val("");
    }
  });
  
  // Enter event
  $(".msg_area").keydown(function(){
    var msg = $(".msg_area").val();
    if(event.keyCode == 13 && msg != ""){
      socket.emit('client_msg', {"msg":msg, "name":name});
      $(".msg_area").val("");
    }
  });
  
  // clear chat area
  $(".clear").bind('click', function(){
    $(".chat_area").empty();
  });
  
  // append msg to chat area 
  socket.on('server_msg', function(data){
    var msg = String(data.msg);
    
    // append <a> tag
    if(msg.slice(0,7).match("http://") || msg.slice(0,8).match("https://")){
      msg = "<a href="+msg+">"+msg+"</a>";
    }
    var name = String(data.name);
    var scroll_pos = $(".chat_area").prop('scrollHeight');
    $(".chat_area").append("<div><div class='inline'>"+name+":  </div><div class='inline'>"+msg+"</div></div>");
    $(".chat_area").animate({ scrollTop: scroll_pos }, "fast");
  })
})
