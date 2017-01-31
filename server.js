var app = require('http').createServer();
var io = require('socket.io')(app);
var fs = require('fs');
var DB = __dirname + '/db.json';

var CLIENTS = {
  ls: null,
  yz: null
};

var TO = {
  ls: 'yz',
  yz: 'ls'
};

app.listen(8888);

io.on('connection', function (socket) {
  var from = socket.handshake.query.from;
  CLIENTS[from] = socket;

  fs.readFile(DB, 'utf8', function (err, data) {
    socket.emit('init', JSON.parse(data));
  });

  socket.on('message', function(data) {
    var db = JSON.parse(fs.readFileSync(DB, 'utf8'));

    db.push({
      content: data,
      from: from
    });

    fs.writeFile(DB, JSON.stringify(db));

    var to = CLIENTS[TO[from]].emit('message', {
      content: data,
      from: from 
    });
  })


  
  // socket.on('my other event', function (data) {
  //   console.log(data);
  // });

});