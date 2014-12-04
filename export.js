var request = require('request');

var url = "http://www.webpagetest.org/jsonResult.php?test=141204_AK_QGR";

request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var json = JSON.parse(body);
    console.log(json);
  }
});