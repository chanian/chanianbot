var should   = require("should"),
    Strategy = require("../lib/strategy");

describe("Strategy", function () {

  describe("#getBB", function () {
    it("should return the BB as calculated by the largest set .blind attribute", function () {
      var game = {};
      var players = [
        { blind: 100 },
        { blind: 50 },
        { blind: 0 },
        { blind: 0 }
      ];
      game.players = players;
      Strategy.getBB(game).should.equal(100);
    });

    it("should default to 0", function () {
      var game = {};
      var players = [];
      game.players = players;
      Strategy.getBB(game).should.equal(0);
    });
  });

  describe("#autoShove", function () {
    it("should return false by default", function () {
      var game = { players: [] };
      Strategy.autoShove(game).should.equal(false);
    });

    it("should return false if there are more than 2 players in the pot", function () {
      var game = {
        players: [
          { state: "active" },
          { state: "active" },
          { state: "active" }
        ]
      }
      Strategy.autoShove(game).should.equal(false);
    });

    it("should return true if OP has < %10 my remaining stack", function () {
      var me = {
        name: "me",
        chips: 1000,
        wagered: 0
      };
      var you = {
        name: "you",
        state: "active",
        chips: 10,
        wagered: 0
      };
      var game = {
        self: me,
        players: [me, you]
      };
      Strategy.autoShove(game).should.equal(true);
    });
  });

  describe("#playersInHand", function () {
    it("should return the total number of players active", function () {
      var players = [
        { state: "active" },
        { state: "active" },
        { state: "active" },
        { state: "active" }
      ];
      var game = { players: players };

      Strategy.playersInHand(game).should.equal(4);
    });

    it("should return the total number of players who haven't folded", function () {
      var players = [
        { state: "folded" },
        { state: "active" },
        { state: "active" },
        { state: "active" }
      ];
      var game = { players: players };

      Strategy.playersInHand(game).should.equal(3);
    });
  });

  describe("#isPotCommitted", function () {
    it("should return false if player has nothing committed to the pot", function () {
      var game = { self: {} };
      game.self.chips = 1000;
      game.self.wagered = 0;

      Strategy.isPotCommitted(game.self).should.equal(false);
    });

    it("should return false if player has less than %70 of stack in hand", function () {
      var game = { self: {} };
      game.self.chips = 990;
      game.self.wagered = 10;

      Strategy.isPotCommitted(game.self).should.equal(false);
    });

    it("should return true if player has %70 or more of stack in hand", function () {
      var game = { self: {} };
      game.self.chips = 300;
      game.self.wagered = 700;

      Strategy.isPotCommitted(game.self).should.equal(true);
    });
  });
});
