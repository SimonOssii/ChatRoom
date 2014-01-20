$(document).ready(function(){
  var docTitle = "Welcome To Chat";
  var img_file;
  document.title = docTitle;
  var socket = io.connect('http://localhost:3000');
  //~ var socket = io.connect('http://10.7.10.100:3000'); // My server ip
  var Myname = $("#wel_name").attr("data-name");
  
  $(".chooseFile").bind("click", function(){
    $("#file").trigger('click');
  });
  
  // Mind images
  $("#your_mind").dialog({
    autoOpen: false,
    width: 450,
    height: 250,
    show: {
      effect: "explode",
      duration: 300
    },
    hide: {
      effect: "explode",
      duration: 300
    }
  });
  
  if(Myname){
    socket.emit('client_user', {"name":Myname});
  }
  
  $("#open_mind").click(function(){
    $( "#your_mind" ).dialog( "open" );
  });
  
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
  });
  
  // send buttion click event
  $(".send").bind('click', function(){
    var msg = $(".msg_area").val(),
        toWho = $(".toWho").attr("data-toWho") ? $(".toWho").attr("data-toWho") : "";
        
    if(msg != ""){
      socket.emit('client_msg', {
        "msg":msg, 
        "name":Myname, 
        "toWho":toWho
      });
      $(".msg_area").val("");
    }
  });
  
  // Typing enter event
  $(".msg_area").keydown(function(){
    var msg = $(".msg_area").val(),
        toWho = $(".toWho").attr("data-toWho") ? $(".toWho").attr("data-toWho") : "";
        
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
  
  $(".mind_img").bind("click", function(){
    var mind = $(this).attr("data-mind"),
        toWho = $(".toWho").attr("data-toWho") ? $(".toWho").attr("data-toWho") : "";
        
    socket.emit('mind_img',{
      "name": Myname,
      "mind": mind,
      "toWho":toWho
    })
  });
  
  // append your mind image to chat area
  socket.on('server_imgs', function(data){
    var name = String(data.name),
        img_url = String(data.img_url),
        toWho = String(data.toWho),
        fromWho = String(data.fromWho),
        scroll_pos = $(".chat_area").prop('scrollHeight');
        
    if(toWho == Myname || fromWho == Myname){
      $(".chat_area").append("<div class='forYou'><div class='inline'>"
        +name+":  </div><div><img src='"+img_url+"'/></div></div>");
      $(".chat_area").animate({ scrollTop: scroll_pos }, "fast");
      if(name != Myname){
        notifyMe("send you a image", name);
      }
    }else if(toWho == ""){
      $(".chat_area").append("<div class='msg'><div class='inline'>"
        +name+":  </div><div><img src='"+img_url+"'/></div></div>");
      $(".chat_area").animate({ scrollTop: scroll_pos }, "fast");
      
      if(name != Myname){
        notifyMe("send you a image", name);
      }
    }
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
    
    var scroll_pos = $(".chat_area").prop('scrollHeight');
    var name = String(data.name);
    var toWho = String(data.toWho);
    var fromWho = String(data.fromWho);
    
    // private chat
    if(toWho == Myname || fromWho == Myname){
      $(".chat_area").append("<div class='forYou'><div class='inline'>"
        +name+":  </div><div class='inline'>"+msg+"</div></div>");
      $(".chat_area").animate({ scrollTop: scroll_pos }, "fast");
      if(name != Myname){
        notifyMe(oriMsg, name);
      }
    }else if(toWho == ""){
      $(".chat_area").append("<div class='msg'><div class='inline'>"
        +name+":  </div><div class='inline'>"+msg+"</div></div>");
      $(".chat_area").animate({ scrollTop: scroll_pos }, "fast");
      if(name != Myname){
        notifyMe(oriMsg, name);
      }
    }
  })
  
  
  //~ // Not finish
  //~ $("#file").bind("change",function(e){
    //~ img_file = $(this).get(0).files[0];
    //~ $('.img_pwd').text($("#file").val());
  //~ })
  
  //~ $(".sendImg").click(function(e){
    //~ if($('.img_pwd').text() == ""){
      //~ return;
    //~ }
    //~ var reader = new FileReader();
    //~ alert(img_file.name);
    //~ socket.emit('client_image', {"name":Myname, "img":img_file.name});
    //~ reader.onload = function(evt){
      //~ socket.emit('client_image', {"name":Myname, "img":img_file.name});
      //~ reader.readAsDataURL(img_file);
    //~ };
  //~ })
})


// HTML5 Notification
function notifyMe(msg, name, img) {
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
