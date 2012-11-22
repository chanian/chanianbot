// Return the numeric rank of a card
var Utils = {};

Utils.getNumericalRank = function (card) {
  var namedRank = card.substr(0, card.length - 1);
  var num = Number(namedRank);
  var map = {
    'a': '14',
    'k': '13',
    'q': '12',
    'j': '11',
    't': '10'
  };
  if (!num) {
    return Number(map[namedRank.toLowerCase()]);
  } else {
    return Number(num);
  }
};

module.exports = Utils;