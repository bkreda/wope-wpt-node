var request = require('request');

var url = "http://www.webpagetest.org/jsonResult.php?test=141204_AK_QGR";

request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var json = JSON.parse(body);
        console.log("firstView loadTime",  json.data.average.firstView.loadTime);
        console.log("start render",  	   json.data.average.firstView.render);
        console.log("repeatView loadTime", json.data.average.repeatView.loadTime);
        console.log("start render", 	   json.data.average.repeatView.render);
    }
});