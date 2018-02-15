'using strict';

var tickerDict = {};

function getPrice (tickerName, response) {
  
  var tickerSymbol = tickerDict[tickerName];
  var string = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + tickerSymbol + '&apikey=73W2LCVLLF04XLIH';  
  
  
  var req = https.get(string, res => {

    var returnData= " ";
    res.setEncoding('utf8');
    
    res.on('data', chunk => {
      returnData = returnData + chunk;
    });

    res.on('error',err => {
      returnData=" ";
    });

    res.on('end', () => {
        response.send(returnData);
        });
    }); 
}

var express = require('express')
var http = require('http');
var https = require('https');
var csv = require('fast-csv');

csv.fromPath('companylist.csv',{ 'headers': true })
.on('data', function(record) {
  tickerDict[record.Name]=record.Symbol;
});
    


var app = express();

app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');


app.get('/pricing', function(req, res) {

  getPrice(req.query['ticker'],res);

});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
