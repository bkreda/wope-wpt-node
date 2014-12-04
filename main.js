var fs 		    = require('fs');
var mkdirp      = require('mkdirp');
var dateFormat  = require('dateformat');

var WebPageTest = require("webpagetest");

var wpt = new WebPageTest('www.webpagetest.org');

//Change me
var runs = 1;    //5 use odd for better median.
var port = 80;

var ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4";

var createOutputDirAndRunTest = function(dirName, sample){
	mkdirp(dirName, function(err) { 

	    if(err) {
	    	console.error(err);
			process.exit(1);    	
	    }

	    var label = sample['label'];
		
		doRunTest({
			"url"     : sample['siteUrl'], 
			"label"   : label, 
			"dirName" : dirName, 
			"suffix"  : "sans-wope"
		});

		doRunTest({
			"url"     : sample['wopeUrl'], 
			"label"   : label, 
			"dirName" : dirName, 
			"suffix"  : "avec-wope"
		});
	});
};

var doRunTest = function(args) {

	var options = {
		"key"         :"217ca6cd335a4e398145d62fa73f078c", 
		"runs"        : runs, 
		"userAgent"   : ua,
	};
		// "pingback"    : "http://wpt.bk.wope-framework.com:" + port,
		// "waitResults" : "localhost:" + port
		

	wpt.runTest(args.url, options, function(err, data) {
		console.log(err || data);
		if(err){
			console.error(err);
			return;
		}

		var testId = data.data.testId;
		console.log("testId: " + testId);			

		var filename = args.dirName + "/" + testId + "-" + args.suffix + ".json";
		console.log(filename);
		
		fs.writeFile(filename, JSON.stringify(data), function(err) {
		    if(err) {
		        console.log(err);
		    } else {
		        console.log("The file was saved!");
		    }
		});
	});
};

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
