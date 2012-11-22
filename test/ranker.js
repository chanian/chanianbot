var should = require("should"),
    Ranker = require("../lib/ranker");

describe("Ranker", function () {
  describe("#getBestHand", function () {
    it("should pick the straight flush", function () {
      var hand = ["ad", "kd", "qd", "ah", "kc"];
      var hole = ["td", "jd"];
      var h = Ranker.getBestHand({community: hand, self: { cards: hole }});

      h.rank.should.equal(9);
      h.name.should.equal("straight flush");
    });

    it("should pick quads", function () {
      var hand = ["ad", "as", "qd", "2h", "kc"];
      var hole = ["ac", "ad"];
      var h = Ranker.getBestHand({community: hand, self: { cards: hole }});

      h.rank.should.equal(8);
      h.name.should.equal("quad 14");
    });

    it("should pick boat", function () {
      var hand = ["ad", "as", "ac", "2h", "2c"];
      var hole = [];
      var h = Ranker.getBestHand({community: hand, self: { cards: hole }});

      h.rank.should.equal(7);
      h.name.should.equal("boat 14 over 2");
    });

    it("should pick flush", function () {
      var hand = ["ad", "kd", "qd", "10d", "2d"];
      var hole = [];
      var h = Ranker.getBestHand({community: hand, self: { cards: hole }});

      h.rank.should.equal(6);
      h.name.should.equal("flush ad,kd,qd,10d,2d");
    });

    it("should pick straight", function () {
      var hand = ["ad", "kd", "qd", "jh", "10d"];
      var hole = [];
      var h = Ranker.getBestHand({community: hand, self: { cards: hole }});

      h.rank.should.equal(5);
      h.name.should.equal("straight 14,13,12,11,10");
    });

    it("should pick trip", function () {
      var hand = ["ad", "ah", "as", "10d", "2d"];
      var hole = [];
      var h = Ranker.getBestHand({community: hand, self: { cards: hole }});

      h.rank.should.equal(4);
      h.name.should.equal("trips 14");
    });

    it("should pick two pair", function () {
      var hand = ["ad", "as", "qd", "qh", "2d"];
      var hole = [];
      var h = Ranker.getBestHand({community: hand, self: { cards: hole }});

      h.rank.should.equal(3);
      h.name.should.equal("two pair 14 - 12");
    });

    it("should pick pair", function () {
      var hand = ["ad", "kd", "qd", "2d", "2h"];
      var hole = [];
      var h = Ranker.getBestHand({community: hand, self: { cards: hole }});

      h.rank.should.equal(2);
      h.name.should.equal("pair 2");
    });

    it("should pick high card", function () {
      var hand = ["ad", "kd", "qd", "10d", "2h"];
      var hole = [];
      var h = Ranker.getBestHand({community: hand, self: { cards: hole }});

      h.rank.should.equal(1);
      h.name.should.equal("14 high");
    });
  });

  describe("#getPairs", function () {
    describe("Quads", function () {
      it("should detect quards", function () {
        var hand = ["ad", "ac", "as", "ah", "kc"];
        var h = Ranker.getPairs(hand);

        h[0].rank.should.equal(14);
        h[0].num.should.equal(4);
      });
    });
    describe("Boat", function () {
      it("should detect a full house", function () {
        var hand = ["ad", "ac", "as", "kh", "kc"];
        var h = Ranker.getPairs(hand);

        h[0].rank.should.equal(14);
        h[0].num.should.equal(3);
        h[1].rank.should.equal(13);
        h[1].num.should.equal(2);
      });
      it("should order the trips first", function () {
        var hand = ["kh", "kc", "2d", "2c", "2s"];
        var h = Ranker.getPairs(hand);

        h[0].rank.should.equal(2);
        h[0].num.should.equal(3);
        h[1].rank.should.equal(13);
        h[1].num.should.equal(2);
      });
    });
    describe("Trips", function () {
      it("should detech trips", function () {
        var hand = ["ad", "ac", "ah", "kc", "2c"];
        var h = Ranker.getPairs(hand);

        h[0].rank.should.equal(14);
        h[0].num.should.equal(3);
      });
    });
    describe("Two Pair", function () {
      it("should detech two pair", function () {
        var hand = ["ad", "ac", "kh", "kc", "2c"];
        var h = Ranker.getPairs(hand);

        h[0].rank.should.equal(14);
        h[0].num.should.equal(2);
        h[1].rank.should.equal(13);
        h[1].num.should.equal(2);
      });
      it("should order the highest pair first", function () {
        var hand = ["2d", "2c", "kh", "kc", "5c", "5d"];
        var h = Ranker.getPairs(hand);

        h[0].rank.should.equal(13);
        h[0].num.should.equal(2);
        h[1].rank.should.equal(5);
        h[1].num.should.equal(2);
        h[2].rank.should.equal(2);
        h[2].num.should.equal(2);
      });
    });
    describe("Pair", function () {
      it("should detech pairs", function () {
        var hand = ["ad", "ac", "qh", "kc", "2c"];
        var h = Ranker.getPairs(hand);

        h[0].rank.should.equal(14);
        h[0].num.should.equal(2);
      });
    })
  });

  describe("#hasStraight", function () {
    describe("when there is no straight", function () {

      it("should return false on an empty hand", function () {
        Ranker.hasStraight([]).should.equal(false);
      });

      it("should return false on a hand with no straight", function () {
        var hand = ["2d", "6d", "7d", "8d", "9d"];
        Ranker.hasStraight(hand).should.equal(false);
      });
    });

    describe("when there is a straight", function () {
      it("should return thruthy", function () {
        var hand = ["5d", "6d", "7d", "8d", "9d"];
        (!!Ranker.hasStraight(hand)).should.equal(true);
      });

      it("should only return the cards in the straight", function () {
        var hand = ["2h", "5d", "6d", "7d", "8d", "9d"];
        Ranker.hasStraight(hand).join("").should.equal("98765");
      });

      it("should return the desc ordered straight", function () {
        var hand = ["2h", "5d", "7d", "6d", "8d", "9d"];
        Ranker.hasStraight(hand).join("").should.equal("98765");
      });

      it("should ignore duplicate rank values", function () {
        var hand = ["5h", "5d", "7d", "6d", "8d", "9d"];
        Ranker.hasStraight(hand).join("").should.equal("98765");
      });
    });
  });

  describe("#hasFlush", function () {
    describe("when there is a flush", function () {
      it("should return truthy", function () {
        var hand = ["ad", "td", "7d", "2d", "4d"];
        (!!Ranker.hasFlush(hand)).should.equal(true);
      });

      it("should return the flush cards", function () {
        var hand = ["Ad", "Td", "7d", "2d", "4d", "2c", "5c"];
        Ranker.hasFlush(hand).join("").should.equal("AdTd7d4d2d");
      });

      it("should return the flush cards in rank desc order", function () {
        var hand = ["Td", "Ad", "7d", "2d", "4d", "2c", "5c"];
        Ranker.hasFlush(hand).join("").should.equal("AdTd7d4d2d");
      });

    });

    describe("when there is no flush", function () {
      it("should return false for an empty hand", function () {
        Ranker.hasFlush([]).should.equal(false);
      });
    });
  });
});