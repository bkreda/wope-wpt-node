var request = require('request');
var walk    = require('walk');
var files   = [];

var dataBySite = [];

var saveResultsToDisk = function(){
	console.log("FINISH");
	
}

var extract = function(url, fileName, label){

	request(url, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	        var json = JSON.parse(body);

	    	console.log(fileName);
	        console.log("firstView loadTime", json.data.average.firstView.loadTime);
	        console.log("firstView render",   json.data.average.firstView.render);

	        //remove suffix
	        if(fileName.indexOf("-sans-wope") > -1){

	        	var testId  = fileName.replace("-sans-wope.json", "");
	        	var testType= "sans";

	        }else{

				var testId  = fileName.replace("-avec-wope.json", "");
				var testType= "avec";
	        }

	        var dataOfSite = dataBySite[label] || {};    //read
			dataOfSite[testType].loadTime = json.data.average.firstView.loadTime;
			dataOfSite[testType].render   = json.data.average.firstView.render;
			dataBySite[label] = dataOfSite;    			 //write
	        

	        if(Object.keys(dataBySite).length * 2 === files.length){
	        	saveResultsToDisk();
	        }
	    }
	});

};

var walkerOptions = {
	listeners:{
		
		"directories" : function (root, dirStatsArray, next) {
		    // dirStatsArray is an array of `stat` objects with the additional attributes
		    // * type
		    // * error
		    // * name
		    next();
	    },

	    'file' : function(root, stat, next) {
		    // Add this file to the list of files
		    //console.log(root + '/' + stat.name);
		    files.push({
		    	"name" : stat.name,
		    	"path" : root + '/' + stat.name
		    });
		    next();
		},

		'end' : function() {
		    for (var i = 0; i < files.length; i++) {
		    	
		    	var metaResult = require(files[i].path);
				console.log(files[i]);
				extract(metaResult.data.jsonUrl, files[i].name, metaResult.data.label);
		    };
		}
	}
}

var walker  = walk.walkSync('./output', walkerOptions);
