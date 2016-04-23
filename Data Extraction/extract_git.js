// Declare variables
var fs = require('fs')
var count = 0;
var languages = [];

// Read the files and send to the callback
fs.readFile('./data/2016-01-01-0.json', handleFile)
fs.readFile('./data/2016-01-01-1.json', handleFile)
fs.readFile('./data/2016-01-01-2.json', handleFile)
fs.readFile('./data/2016-01-01-3.json', handleFile)
fs.readFile('./data/2016-01-01-4.json', handleFile)
fs.readFile('./data/2016-01-01-5.json', handleFile)
fs.readFile('./data/2016-01-01-6.json', handleFile)
fs.readFile('./data/2016-01-01-7.json', handleFile)
fs.readFile('./data/2016-01-01-8.json', handleFile)
fs.readFile('./data/2016-01-01-9.json', handleFile)
fs.readFile('./data/2016-01-01-10.json', handleFile)
fs.readFile('./data/2016-01-01-11.json', handleFile)


// Write the callback function
function handleFile(err, data) {
    if (err) throw err;
    var obj = [];
    var linesInFile = data.toString().split('\n');

    var property = "language";
    for(var i = 0; i < linesInFile.length - 2; i++){
        var thisEntry = JSON.parse(linesInFile[i]);
        if( thisEntry.type === "PullRequestEvent") {
            thisEntry.language = thisEntry.payload.pull_request.base.repo.language;
            thisEntry.forks = thisEntry.payload.pull_request.base.repo.forks;
            if(thisEntry.language != null) {
                languages = languages.concat( {
                    language: thisEntry.language,
                    forks: thisEntry.forks,
                } );
            }
        }
    }
    count++;
    console.log("Parsed " + count + " files...");
    if(count > 11) {
        var sortedLanguages = sumAndSort(languages);
        var total = 0;
        for(var i = 0; i < sortedLanguages.length; i++){
            total += sortedLanguages[i].cnt;
        }
        console.log("Records parsed: " + total);

        fs.writeFileSync('./data.json', JSON.stringify(sortedLanguages) , 'utf-8'); 
    }
}


function sumAndSort(array) {
    var languagesInResults = [];
    var results = [];
    for(var i = 0; i < array.length; i++){
        if (languagesInResults.indexOf(array[i].language) === -1) {
            languagesInResults.push(array[i].language);
            results.push({
                languageName: array[i].language,
                cnt:1,
                forks: [array[i].forks]
            })
        }
        else {
            results[languagesInResults.indexOf(array[i].language)].cnt++;
            results[languagesInResults.indexOf(array[i].language)].forks.push(array[i].forks);
        }
    }
    for(var i = 0; i < results.length; i++) {
        results[i].forks = arrayAv(results[i].forks);
    }
    function compare(a,b) {
      if (a.cnt < b.cnt)
        return -1;
      else if (a.cnt > b.cnt)
        return 1;
      else 
        return 0;
    }
    function arrayAv(array) {
        var array = array;
        var av = 0;
        for(var i = 0; i < array.length; i++) {
            av += array[i];
        }
        return Math.round(av / array.length);
    }
    results.sort(compare);
    return results;
}

//Unused function
function searchInnerProperties(val, prop) {
    var results = [ { id:null, name:null, language: null }];

    r(val, prop);
    return results;
    function r(val, prop) {
    	//console.log(val);
        if (Object.prototype.toString.call(val) === '[object Object]') {
            for (var propertyName in val) {
            	if(propertyName === prop) {
                    if(val[prop] != null) {
                        if(results[results.length-1].id != val.id && results[results.length-1].name != val.name) {
            	        	console.log("hit!");
                            results.push(val[prop]);
                        }
                    }
    	        }
                r(val[propertyName], prop);
            }
        }
        else if (Object.prototype.toString.call(val) === '[object Array]') {

            val.map(function(array) {
    		  return r(array, prop);
    		});
        }
        else {
        	//console.log(val);
        }
    }
}