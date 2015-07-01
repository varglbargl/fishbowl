exports.rooms = [
  {
    phase: 'ask',
    prompt: null,
    currentAsker: 0,
    players: {
      // player: "string",
      // answer: "string",
      // out: boolean
    }
  }
];

exports.joinRoom = function (user, room, id) {
  if (!exports.rooms[room]) {
    exports.rooms.push({prompt:'', players: [], phase: 'ask'});
  }
  exports.rooms[room].players[id] = {player: user, answer: null, out: true};
};

exports.leaveRoom = function (id, room) {
  if (exports.rooms[room].phase === 'post-answer') {
    restart(room);
  }
  delete exports.rooms[room].players[id];
  if (Object.keys(exports.rooms[room].players).length === 0 && exports.rooms.length > 1) {
    exports.rooms[room] = null;
  }
  if (exports.rooms[room].currentAsker >= Object.keys(exports.rooms[room].players).length) {
    exports.rooms[room].currentAsker = 0;
  }
};

exports.guess = function (room, player, guess) {
  var players = exports.rooms[room].players;
  var correct = false;
  var activePlayers = 0;

  for (var answer in players) {
    if (players[answer].player === player && players[answer].answer === guess) {
      players[answer].out = true;
      correct = true;
    }
    if (!players[answer].out) {
      activePlayers++;
    }
  }

  if (activePlayers === 0) {
    restart(room);
  }

  return correct;
};


exports.answer = function (room, player, answer) {
  var players = exports.rooms[room].players;
  var complete = true;

  for (var user in players) {
    if (players[user].player === player) {
      players[user].answer = answer;
    }

    if (!players[user].answer && !players[user].out) {
      complete = false;
    }
  }

  return complete;
};

exports.newRound = function (room) {
  room = exports.rooms[room];
  room.phase = 'post-answer';

  for (var player in room.players) {
    room.players[player].out = false;
  }
};

var restart = function (room) {
  room = exports.rooms[room];
  room.phase = 'ask';
  room.prompt = null;
  room.currentAsker++;
  if (room.currentAsker >= room.players.length) {
    room.currentAsker = 0;
  }

  for (var player in room.players) {
    room.players[player].out = true;
    room.players[player].answer = null;
  }
};
