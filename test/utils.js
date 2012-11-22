var should = require("should"),
    Utils = require("../lib/utils");

describe("Utils", function () {
  describe("#getNumericalRank", function () {

    it("should return the card value", function () {
      Utils.getNumericalRank("9d").should.equal(9);
      Utils.getNumericalRank("Td").should.equal(10);
      Utils.getNumericalRank("Jd").should.equal(11);
      Utils.getNumericalRank("Qd").should.equal(12);
      Utils.getNumericalRank("Kd").should.equal(13);
      Utils.getNumericalRank("Ad").should.equal(14);
    });

    it("should be case insensitive", function () {
      Utils.getNumericalRank("Ad").should.equal(14);
      Utils.getNumericalRank("ad").should.equal(14);
    });

  });
});