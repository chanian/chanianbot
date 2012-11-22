var Reporter = {};
(function () {
  var data = [];
  Reporter.report = function (msg) {
    data.push(msg);
  }
  Reporter.dump = function () {
    return data;
  }
})();
module.exports = Reporter;