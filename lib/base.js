var streets = {
  'pre-flop': function (game) {
    var range = Strategy.getRange(game.self.cards);

    // dude's almost dead, autoshove
    if (Strategy.autoShove(game)) {
      return game.self.chips;
    }

    // i'm almost dead (10xBB) , autoshove!
    if (range >= 4) {
      if (game.self.chips < (Strategy.getBB(game) * 10)) {
        return game.self.chips;
      }
    }

    // always raise pre with premium
    if (range === 1) {
      return Math.max(game.betting.raise, Strategy.getBB(game) * (3 + Math.random()));
    }

    // auto raise with class 2
    if (range === 2) {
      return Math.max(game.betting.call, Strategy.getBB(game) * (2 + Math.random()));
    }

    // flat with mid ranged hands
    if (range <= 3 && Strategy.countBets(game) < 2) {
      return game.betting.call;
    }

    return 0;
  },

  'flop': function (game) {
    return Strategy.basic(game);
  },

  'turn': function (game) {
    return Strategy.basic(game);
  },

  'river': function (game) {
    return Strategy.basic(game);
  },

  'complete': function (game) {
    // remember all the info about this round
    Read.remember(game);

    // I just got knocked out, print what happened
    if (!game.self.chips) {
      console.log(game);
    }
  }
}

// compatible with: https://github.com/mdp/MachinePoker
exports.play = function(game) {
  if (game.state === "complete")     { streets.complete(game); return 0; }
  if (game.self.state !== "active")  { return; }

  return streets[game.state](game);
};
