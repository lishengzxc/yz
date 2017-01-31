$(function() {
  var user = location.hash.slice(1) || 'yz';

  var $body = $('body');
  var $inputer = $('.inputer');
  var $scroller = $('.scroller');
  var $input = $inputer.find('input');

  var self = this;

  $body.addClass(user);

  var socket = io('//' + location.hostname + ':8888?from=' + user);

  socket.on('init', function (data) {
    data.forEach(item => {
      appendDialog(item.content, item.from === user ? 'me' : '');
    })
  })

  socket.on('message', function (data) {
    appendDialog(data.content);
  })

  $inputer.on('submit', function(e) {
    e.preventDefault();
    onSubmit();
    
  })

  function createDialog(content, from) {
    return '' + 
      '<div class="dialog ' + from + '">' + 
        '<div class="avatar"></div>' +
        '<div class="sentence">' +
          content +
        '</div>' +
      '</div>'
  }

  function appendDialog(content, from) {
    var dialog = createDialog(content, from);
    $scroller.append(dialog);
    $scroller.scrollTop(Number.MAX_SAFE_INTEGER);
  }

  function onSubmit() {
    var val = $input.val();
    $input.val('');

    appendDialog(val, 'me');
    

    socket.emit('message', val)
  }
});