var Utils   = require('./utils.js');
var Ranker  = {};

// Hand rankings
Ranker.hasFlush = function (hand, cardsInFlush) {
  var cardsInFlush = cardsInFlush || 5
    , suits = {};

  if (hand.length < cardsInFlush) { return false; }

  // map each card to a suit map
  hand.forEach(function (c) {
    suits[c.slice(-1)] = (suits[c.slice(-1)] || 0) + 1;
  });

  // see if any suit has >= flush
  var suit;
  for(var s in suits) {
    if (suits[s] >= cardsInFlush) {
      suit = s;
    }
  };

  // now only trim out the highest ranking suited cards
  if (suit)  {
    hand = hand.sort(function (a, b) {
      return Utils.getNumericalRank(a) < Utils.getNumericalRank(b);
    }).filter(function (c) {
      return c.slice(-1) == suit;
    });
    return hand;
  }
  return false;
}

Ranker.hasStraight = function (hand) {
  var count
    , index
    , r
    , topRank
    , straight = [];

  // cant have a < 5 carder
  if (hand.length < 5) { return false; }

  // strip the suits
  hand = (hand.map(function(c) {
    return Utils.getNumericalRank(c);
  })).sort(function (a, b) { return a < b; });

  // straight requires a 5 or 10
  if (hand.indexOf(5) === -1 && hand.indexOf(10) === -1) { return false; }

  // strip out any dups
  hand = hand.filter( function(rank, index) {
    return rank != hand[index - 1];
  });

  // try to find the straight
  count = 1;
  for(index = 1; index < hand.length; index++) {
    r = hand[index]

    // still looking good
    if ((hand[index - 1] - 1) === r) {
      straight.push(hand[index - 1]);
      count++;

    // found a gap, reset
    } else {
      straight = [];
      count = 1;
    }

    // found a straight, report it
    if (count === 5) {
      straight.push(hand[index]);
      return straight;
    }
  };
  return false;
}

Ranker.getPairs = function (hand) {
  var index
    , rank
    , orderedPairs = []
    , pairs = {};

  // strip out the suit of each card
  hand = (hand.map(function(c) {
    return Utils.getNumericalRank(c);
  })).sort(function (a, b) { return a < b; });

  // make a frequency map of rank occurances
  for(index = 0; index < hand.length; index++) {
    rank = hand[index];
    pairs[rank] = (pairs[rank] || 0) + 1;
  };

  // create an ordered array of pairs / ranks
  orderedPairs = []
  for(rank in pairs) {
    orderedPairs.push({
      rank: Number(rank),
      num: pairs[rank]
    });
  }

  // sort based on frequency of rank, then by rank itself
  orderedPairs = orderedPairs.sort(function (a, b) {
    if (a.num < b.num) {
      return true;
    } else if (a.num == b.num) {
      return a.rank < b.rank;
    }
    return false;
  });
  return orderedPairs;
}

Ranker.getBestHand = function (game) {
  var s = Ranker.hasStraight(game.community.concat(game.self.cards))
    , f = Ranker.hasFlush(game.community.concat(game.self.cards))
    , fd = Ranker.hasFlush(game.community.concat(game.self.cards), 4)
    , groupedPairs = (Ranker.getPairs(game.community.concat(game.self.cards)))
    // , c1 = Utils.getNumericalRank(game.self.cards[0])
    // , c2 = Utils.getNumericalRank(game.self.cards[1])
    , hand = []
    , i;

  // assemble a 5 card paird hand
  for (i in groupedPairs) {
    if (hand.length + groupedPairs[i].num <= 5) {
      for (var j = 0; j < groupedPairs[i].num; j++) { hand.push(groupedPairs[i].rank); }
    }
  }

  // Straight Flush
  if (f && s) {
    return {
      rank: 9,
      name: "straight flush"
    };
  }

  // Quads
  if ((groupedPairs[0].num == 4)) {
    return {
      rank: 8,
      name: "quad " + groupedPairs[0].rank
    };
  };

  // Boat
  if ((groupedPairs[0].num == 3) && (groupedPairs[1].num == 2)) {
    return {
      rank: 7,
      name: "boat " + groupedPairs[0].rank + " over " + groupedPairs[1].rank
    };
  };

  // Flush
  if (f) {
    return {
      rank: 6,
      name: "flush " + f
    };
  }

  // Straight
  if (s) {
    return {
      rank: 5,
      name: "straight " + s
    };
  }

  // Trips
  if ((groupedPairs[0].num == 3)) {
    return {
      rank: 4,
      name: "trips " + groupedPairs[0].rank
    };
  }

  // 2-pair
  if ((groupedPairs[0].num == 2) && (groupedPairs[1].num == 2)) {
    return {
      rank: 3,
      name: "two pair " + groupedPairs[0].rank + " - " + groupedPairs[1].rank
    };
  };

  // 1-pair
  if ((groupedPairs[0].num == 2)) {
    return {
      rank: 2,
      name: "pair " + groupedPairs[0].rank
    };
  }

  // high card
  return {
    rank: 1,
    name: groupedPairs[0].rank + " high"
  };
}

module.exports = Ranker;