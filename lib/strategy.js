var Utils     = require('./utils.js');
var Strategy  = {};

var A = 14;
var K = 13;
var Q = 12;
var J = 11;
var T = 10;

// Return the hand range of a starting hand
Strategy.getRange = function (hand) {
  var isPP = false
    , rank1 = Utils.getNumericalRank(hand[0])
    , rank2 = Utils.getNumericalRank(hand[1])
    , diff = Math.abs(rank1 - rank2)
    , isSuited = (diff === 0)
    , isConnected = (diff === 1)
    , isSemiConnected = (diff === 2)
    , orderedRanks = rank1 > rank2 ? [rank1, rank2] : [rank2, rank1]
    , rankA = orderedRanks[0]
    , rankB = orderedRanks[1];

  // AA, KK, QQ, JJ, AKs
  if ((isPP && rankA >= J) || (isSuited && rankB > Q))  {
    return 1;

  // 10's, AK, AQs, AJs, KQs
  } else if ((isPP && (rankA >= T))
          || (rankB > Q)
          || (isSuited && rankB >= Q)
          || (rankA === A && rankB === J))
  {
    return 2;

  //99, JTs, QJs, KJs, ATs, AQ
  } else if ((isPP && (rankA >= 9))
          || (rankB >= Q)
          || (isSuited && rankB >= J)
          || (isSuited && rankA === J && rankB === T))
  {
    return 3;

  // magic hands
  } else if (isPP || (isSuited && rankB >= 7)) {
    return 4;
  }
  return 5;
  //T9s, KQ, 88, QTs, 98s, J9s, Aj KTs
};

// Count the total players who are still alive
Strategy.livePlayers = function (game) {
  return game.players.length;
}

// Count the live players in the hand
Strategy.playersInHand = function (game) {
  var players = 0;
  game.players.forEach(function (player) {
    players += (player.state !== "folded");
  });
  return players;
}

// Count the number of bets in this round
Strategy.countBets = function (game) {
  var betCount = 0;
  game.players.forEach(function (player) {
    if (player.actions[game.state]) {
      betCount += (player.actions[game.state].filter(function (action) {
        return action.type === "raise";
      }).length);
    }
  });
  return betCount;
}

// Return the size of the current pot
Strategy.getPotSize = function (game) {
  return game.players.reduce(function (sum, player) {
    return sum + (player.wagered + player.blind + player.ante);
  }, 0);
}

// Determine if player is pot committed
Strategy.isPotCommitted = function (player) {
  var startingChips = player.wagered + player.chips;
  var commitment = (player.wagered / startingChips);
  return commitment >= 0.7;
}

// Determine if the other player is almost dead, and I should autoshove
Strategy.autoShove = function (game) {
  var op;
  if (Strategy.livePlayers(game) !== 2) { return false; }

  op = game.players.filter(function (p) {
    return p.name !== game.self.name && p.state === "active";
  })[0];

  var stack = op.chips;
  return (game.self.chips > stack) && ((stack/game.self.chips) < 0.1);
}

// Return the current Big Blind value
Strategy.getBB = function (game) {
  var bb = 0;
  game.players.forEach(function (p) {
    bb = Math.max(bb, p.blind);
  });
  return bb;
}

Strategy.basic = function (game) {
  console.log("0")
  var hand = Ranker.getBestHand(game);
  var hand2 = Ranker.getBestHand({ community: game.community, self: { cards: [] }});

  // playing the board for now, take it EZ
  if (hand.name != hand2.name) {
    return 0;
  }

  // dude's almost dead, autoshove
  if (Strategy.autoShove(game)) {
    return game.self.chips;
  }

  // boat or better - keep betting?
  if (hand.rank >= 7) {
    return game.self.chips;
    return Math.min(game.self.chips, Strategy.getBB(game) * 8);
  }

  // flush?
  if (hand.rank > 5) {
    return Math.min(game.self.chips, Strategy.getBB(game) * 5);
  }

  // "I have trips!" / straight?
  if (hand.rank >= 4) {
    return Math.min(game.self.chips, Strategy.getBB(game) * 3);
  }

  // always min raise into empty pots
  if (!Strategy.countBets(game)) {
    return game.betting.raise;
  }

  return 0;
}

module.exports = Strategy;