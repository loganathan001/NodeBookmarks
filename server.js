var port = 3000;
var express = require('express');
var app = express();

app.use(express.bodyParser());

app.get('/', function(req, res){
  res.send('hello world');
});

require("./bookmarks").load(app);

app.listen(port);
console.log("Server has started and lisening to port " + port);