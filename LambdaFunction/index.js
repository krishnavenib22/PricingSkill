'using strict'

 

var Alexa = require('alexa-sdk');

var http = require('http');

const APP_ID='amzn1.ask.skill.0f47dcbe-316b-46fb-b807-731c0634e69a';

const languageStrings = {

    'en': {

        'translation': {

            'WELCOME' : "Welcome to the Pricing Application!",

            'HELP'    : "You can ask me for the current price of any stock",

            'STOP'    : "Okay, see you next time!",

            'UNHANDLED': "Give me a name to get the stock price.",

        }

    }

};

 
function GetPrice(stockTicker, date, callback){
          

        var string = 'http://ec2-52-201-245-37.compute-1.amazonaws.com/pricing?ticker='+ stockTicker;   

        var req = http.get(string, res => {

        res.setEncoding('utf8');

        var returnData = "";

 

        res.on('data', chunk => {

            returnData = returnData + chunk;

        });

 

        res.on('end', () => {

            var priceObj = JSON.parse(returnData);
 
            var timeseriesObj = priceObj["Time Series (Daily)"];

            var dateObj = timeseriesObj[date];

            var stockPrice = dateObj["1. open"];

            callback(stockPrice); 

        

        });

 

    });        

};

 

const handlers={

                'LaunchRequest': function () {

        let say = this.t('WELCOME') + ' ' + this.t('HELP');

        this.response.speak(say);

        this.emit(':responseReady');

    },

               

                 'GetPricing' : function() {

                                const intentObj = this.event.request.intent;

                                var stockName = intentObj.slots.Ticker.value; //Get the name of the stock from the slot

                                var date = intentObj.slots.Date.value; //Get the date from the slot

                                

                                GetPrice(stockName , date, (price) => {

                                                this.response.speak('The price of ' + stockName + ' is ' + price);

                                                this.emit(':responseReady');

                                });
                },

               

                'AMAZON.NoIntent': function () {

                                this.response.speak(this.t('STOP'));

        this.emit(':responseReady');

    },

    'AMAZON.HelpIntent': function () {

        this.response.speak(this.t('HELP')).listen(this.t('HELP'));

        this.emit(':responseReady');

    },

    'AMAZON.CancelIntent': function () {

        this.response.speak(this.t('STOP'));

        this.emit(':responseReady');

    },

    'AMAZON.StopIntent': function () {

        this.emit('SessionEndedRequest');

    },

    'SessionEndedRequest': function () {

        this.response.speak(this.t('STOP'));

        this.emit(':responseReady');

    }

};

 

exports.handler = function(event, context, callback) {

    const alexa = Alexa.handler(event, context, callback);

    alexa.appId = APP_ID // APP_ID is your skill id which can be found in the Amazon developer console where you create the skill.

    alexa.resources = languageStrings;

                alexa.registerHandlers(handlers);

                alexa.execute();

};

