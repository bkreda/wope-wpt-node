var request = require('request');
var walk    = require('walk');
var files   = [];

var loadTimesSansWope = [];
var renderTimesSansWope = [];

var loadtimesAvecWope = [];
var rendertimesAvecWope = [];


var saveResultsToDisk = function(){
	console.log("FINISH");
	// TODO need to find a way to get rid of associative arrays.
}

var extract = function(url, fileName){

	request(url, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	        var json = JSON.parse(body);

	    	console.log(fileName);
	        console.log("firstView loadTime", json.data.average.firstView.loadTime);
	        console.log("firstView render",   json.data.average.firstView.render);

	        //remove suffix
	        if(fileName.indexOf("-sans-wope") > -1){

	        	var testId = fileName.replace("-sans-wope.json", "");
	        	loadTimesSansWope[testId]  = json.data.average.firstView.loadTime;
				renderTimesSansWope[testId]= json.data.average.firstView.render;
	        }else{

				var testId = fileName.replace("-avec-wope.json", "");
	        	loadtimesAvecWope[testId]  = json.data.average.firstView.loadTime;	        	
	        	rendertimesAvecWope[testId]= json.data.average.firstView.render;
	        }
	        

	        if(Object.keys(loadTimesSansWope).length * 2 === files.length){
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
		    console.log("stat:", stat);
		    
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
				
				extract(metaResult.data.jsonUrl, files[i].name);
		    };
		}
	}
}

var walker  = walk.walkSync('./output', walkerOptions);
