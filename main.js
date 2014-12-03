var fs = require('fs');
var mkdirp = require('mkdirp');
var dateFormat = require('dateformat');

var WebPageTest = require("webpagetest");

var wpt = new WebPageTest('www.webpagetest.org');

//chang me
var runs = 1;    //5 use odd for better median.

var ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4";

var createOutputDirAndRunTest = function(dirName, sample){
	mkdirp(dirName, function(err) { 

	    if(err) {
	    	console.error(err);
			process.exit(1);    	
	    }

	    var label = sample['label'];
		doRunTest(sample['siteUrl'], label, dirName, "sans-wope");
		doRunTest(sample['wopeUrl'], label, dirName, "avec-wope");
	});
}

var doRunTest = function(url, label, dirName, fileSuffix) {
	wpt.runTest('http://www.darty.com/', {"key":"217ca6cd335a4e398145d62fa73f078c", "runs":runs, "userAgent" : ua}, function(err, data) {
		console.log(err || data);
		if(err){
			console.error(err);
			return;
		}

		var testId = data.data.testId;
		console.log("testId: " + testId);			

		var filename = dirName + "/" + testId + "-" + fileSuffix + ".json";
		console.log(filename);
		
		fs.writeFile(filename, JSON.stringify(data), function(err) {
		    if(err) {
		        console.log(err);
		    } else {
		        console.log("The file was saved!");
		    }
		});
	});
}


//create a unique output folder
var now = new Date();
var dirName = dateFormat(now, "yyyy-mm-dd-hh-MM-ss");
dirName = './output/' + dirName;
console.log(dirName);

//read urls:
var urls = require('./urls.json');
for (var i = 0; i < urls.length; i++) {
	var sample = urls[i];
	createOutputDirAndRunTest(dirName, sample);
};
