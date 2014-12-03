var WebPageTest = require("webpagetest");

var wpt = new WebPageTest('www.webpagetest.org');

//chang me
var runs = 1;    //5 use odd for better median.

var ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4";
wpt.runTest('http://www.darty.com/', {"key":"217ca6cd335a4e398145d62fa73f078c", "runs":runs, "userAgent" : ua}, function(err, data) {
  console.log(err || data);

  console.log("testId: " + data.data.testId);
});
