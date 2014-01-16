$(document).ready(function(){
  var docTitle = "Welcome To Chat";
  document.title = docTitle;
  //~ var socket = io.connect('http://localhost:3000');
  var socket = io.connect('http://10.7.10.100:3000');
  var Myname = $("#wel_name").attr("data-name");
  
  if(Myname){
    socket.emit('client_user', {"name":Myname});
  }
  
  // append User and User login msg
  socket.on("Users", function(data){
    var scroll_pos = $(".chat_area").prop('scrollHeight');
    $(".chat_area").append("<div class='msg'><p class='login_msg'>"
      +data.name + data.status +"</p></div>");
    $(".chat_area").animate({ scrollTop: scroll_pos }, "fast");
    $(".users_list").empty();
    for(var idx in data.ar){
      var user = data.ar[parseInt(idx)];
      $(".users_list").append("<tr id='"+user.id+"' class='user_li' data-name='"+user.name+"'><td>"
        + user.name+"</td></tr>"
      );
    }
    $(".user_li").click(function(){
      $(".private_area").empty();
      $(".private_area").append("<p class='toWho inline' data-toWho='"
        + $(this).attr("data-name") + "'>" +$(this).attr("data-name")+ "</p>");
      $(".private_area").append("<button class='clear_toWho inline btn btn-danger btn-xs'>"
        + "X</button>"
      );
      $(".clear_toWho").bind("click", function(){
        $(".private_area").empty();
      })
    })
  })
  
  // Click event
  $(".send").bind('click', function(){
    var msg = $(".msg_area").val();
    var toWho = $(".toWho").attr("data-toWho") ? $(".toWho").attr("data-toWho") : "";
    if(msg != ""){
      socket.emit('client_msg', {
        "msg":msg, 
        "name":Myname, 
        "toWho":toWho
      });
      $(".msg_area").val("");
    }
  });
  
  // Enter event
  $(".msg_area").keydown(function(){
    var msg = $(".msg_area").val();
    var toWho = $(".toWho").attr("data-toWho") ? $(".toWho").attr("data-toWho") : "";
    if(event.keyCode == 13 && msg != ""){
      socket.emit('client_msg', {
        "msg":msg, 
        "name":Myname, 
        "toWho":toWho
      });
      $(".msg_area").val("");
    }
  });
  
  // clear chat area
  $(".clear").bind('click', function(){
    $(".chat_area").empty();
  });
  
  $(".toWho").dblclick(function(){
    $(this).attr("data-toWho", "").empty();
  })
  
  // append msg to chat area 
  socket.on('server_msg', function(data){
    var oriMsg = String(data.msg);
    
    // append <a> tag
    if(oriMsg.slice(0,7).match("http://") || oriMsg.slice(0,8).match("https://")){
      var msg = "<a href='"+oriMsg+"' target='_blank'>"+oriMsg+"</a>";
    }else{
      var msg = oriMsg;
    }
    
    var name = String(data.name);
    var toWho = String(data.toWho);
    var fromWho = String(data.fromWho);
    
    // private chat
    if(toWho == Myname || fromWho == Myname){
      var scroll_pos = $(".chat_area").prop('scrollHeight');
      $(".chat_area").append("<div class='forYou'><div class='inline'>"
        +name+":  </div><div class='inline'>"+msg+"</div></div>");
      $(".chat_area").animate({ scrollTop: scroll_pos }, "fast");
      if(name != Myname){
        blinkNow = true;
        notifyMe(oriMsg, name)
      }
    }else if(toWho == ""){
      var scroll_pos = $(".chat_area").prop('scrollHeight');
      $(".chat_area").append("<div class='msg'><div class='inline'>"
        +name+":  </div><div class='inline'>"+msg+"</div></div>");
      $(".chat_area").animate({ scrollTop: scroll_pos }, "fast");
      if(name != Myname){
        blinkNow = true;
        notifyMe(oriMsg, name)
      }
    }
  })
})


// HTML5 Notification
function notifyMe(msg, name) {
  if (Notification.permission === "granted") {
    var n = new Notification(name, {body: msg});
    n.onshow = function(){
      setTimeout(function(){n.close()}, 800); 
    }
  }
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {

      if(!('permission' in Notification)) {
        Notification.permission = permission;
      }

    });
  }
}
