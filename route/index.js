module.exports.login = function(req, res){
  res.render('login.html');
}

module.exports.index = function(req, res){
  if(!req.body.nickname){
    res.redirect('/')
  }
  var name = req.body.nickname;
  res.render('index.html', {"name": name});
}
