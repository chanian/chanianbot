var Utils     = require('./utils.js');
var Read      = {};

// Given a player's hand history, classify them
Read.classifyPlayer = function (playerHistory) {
  var hands = playerHistory['hands']
    , flopPercentage = (playerHistory['flop'] || 0) / hands
    , avgShowdownStrength = (playerHistory['ranges'].reduce(function (j, i) { return i + j }, 0)) / playerHistory['showdowns']
    , showdownPercentage = (playerHistory['showdowns'] || 0) / hands
    , winPercentage = (playerHistory["wins"] || 0) / hands
    , preflopRaisePercentage = (playerHistory["pre-flop-raise"] || 0) / hands
    , foldsOnPreFlop = (playerHistory["pre-flop-fold"] || 0) / hands
    , foldsOnFlop    = (playerHistory["flop-fold"] || 0) / playerHistory["flop"]
    , foldsOnTurn    = (playerHistory["turn-fold"] || 0) / playerHistory["turn"]
    , foldsOnRiver   = (playerHistory["river-fold"] || 0) / playerHistory["river"];

  // console.log("preflopRaise% " + preflopRaisePercentage)
  // console.log("showdown strength " + avgShowdownStrength);
  // console.log("flop% " + flopPercentage);
  // console.log("showdown% " + showdownPercentage);
  // console.log("win% " + winPercentage);

  // console.log("fold% ");
  // console.log(foldsOnPreFlop)
  // console.log(foldsOnFlop)
  // console.log(foldsOnTurn)
  // console.log(foldsOnRiver)

  // LOOSE
}

// build a model for other players

Read.remember = function (game) {
  // // analyze the hand history
  game.players.forEach(function (player) {
    // if (player.name === "foldBot1") console.log(player);
    game.self.brain[player.name] = game.self.brain[player.name] || {};
    var read = game.self.brain[player.name];

    // cound the hands played
    read["hands"] = (read["hands"] || 0) + 1;

    // sum up their per street history
    for(var street in player.actions) {
      read[street] = (read[street] || 0) + 1;
      player.actions[street].forEach(function (act) {
        read[act.type] = (read[act.type] || 0) + 1;
        read[street + "-" + act.type] = (read[street + "-" + act.type] || 0) + 1;
      });
    }

    // sum up their overall history
    var read = game.self.brain[player.name] || {};
    if (player.cards) {
      read['showdowns'] = (read['showdowns'] || 0) + 1;
      read['ranges'] = (read['ranges'] || []);
      read['ranges'].push(Strategy.getRange(player.cards));
    }
    game.self.brain[player.name] = read;
  });

  // analyze the win history
  game.winners.forEach(function (player) {
    var winner = game.self.brain[game.players[player.position].name];
    winner.wins = (winner.wins || 0) + 1;
  });
}


module.exports = Read;