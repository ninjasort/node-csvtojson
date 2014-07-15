var fs = require('fs');
var prompt = require('prompt');
var Converter = require("csvtojson").core.Converter;

var CsvConverter = {

    input: __dirname + '/add_csvs_here',

    output: __dirname + '/exports',

    csvs: [],

    jsons: [],

    loadCsvs: function () {
        this.csvs = fs.readdirSync(this.input);
    },

    readFiles: function () {
        var self = this;
        var path,
            stream,
            read = [];

        // create converter
        this.conversion = new Converter({
            constructResult: true
        });

        // convert all csvs
        for (var i = 0; i < this.csvs.length; i++) {
            path = this.input + '/' + this.csvs[i];
            stream = fs.createReadStream(path);
            stream.pipe(this.conversion);
        }

    },

    exportJSON: function () {
        var json,
            stream,
            self = this;
        this.conversion.on('end_parsed', function (json) {
        	self.jsons = json;
			var jsonString = JSON.stringify(json);

            for (var i in self.csvs) {
                json = self.csvs[i].split('.csv')[0] + '.json';
                path = self.output + '/' + json;
                stream = fs.createWriteStream(path);
                console.log('\n-------------------------------------- \n Converting ' + self.csvs[i] + ' to ' + json);
            	stream.write(jsonString);
                stream.end();
            }
            console.log('\n-------------------------------------- \n Finished conversion. CSV --> JSON');

        });
    },

    start: function () {
        for (var func in CsvConverter) {
            if (typeof CsvConverter[func] == 'function' &&
                func !== 'start') {
                CsvConverter[func]();
            }
        }
    }

};

CsvConverter.start();