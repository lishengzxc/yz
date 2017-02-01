var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var static = require('node-static');
var DB = __dirname + '/db.json';

var fs = require('fs');
var file = new static.Server('./');

var CLIENTS = {
  ls: null,
  yz: null
};

var TO = {
  ls: 'yz',
  yz: 'ls'
};

app.listen(8888);

function handler(request, response) {
  request.addListener('end', function () {
    file.serve(request, response);
  }).resume();
}

io.on('connection', function (socket) {
  var from = socket.handshake.query.from;
  CLIENTS[from] = socket;

  fs.readFile(DB, 'utf8', function (err, data) {
    socket.emit('init', JSON.parse(data));
  });

  socket.on('message', function (data) {
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
});