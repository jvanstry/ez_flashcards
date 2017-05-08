var path = require('path');
var pathToResults = path.join(__dirname, '../data/results.csv');
var fs = require('fs');
var csv = require('csvtojson');
var plotly = require('plotly')('jvanstry','0ohk7q3dAUYHpeAx1RPV');
var tempNum = 1;

exports.getResults = function(req, res, next) {

  var trace1 = {
    x: [],
    y: [],
    type: "scatter"
  };

  csv()
    .fromFile(pathToResults)
    .on('json',function(jsonLine){

      trace1.x.push(jsonLine.date);
      trace1.y.push(jsonLine.correct);
    })
    .on('done',function(error){

      var figure = { 'data': [trace1] };

      var imgOpts = {
          format: 'png',
          width: 1000,
          height: 500
      };

      plotly.getImage(figure, imgOpts, function (error, imageStream) {
        console.log('here');
        if (error) return console.log (error);

        var fileStream = fs.createWriteStream('./public/images/temp' + tempNum + '.png');
        imageStream.pipe(fileStream);

        var returnStr = 'success' + tempNum;
        tempNum++;
        res.end(returnStr); 
        next();
      });
    });
};

exports.newResult = function(req, res) {
  var resultDate = getTodaysDate();
  console.log(req)
  console.log(req.body)
  var correct = req.body.correct;
  var userId = req.params.userId || 1;

  var csvString = '\n' + correct + "," + resultDate + "," + userId;
  fs.appendFileSync(pathToResults, csvString)

  res.send('bueno');
};

function getTodaysDate(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var hh = today.getHours();
  var min = today.getMinutes();
  var ss = today.getSeconds();

  var yyyy = today.getFullYear();
  if(dd < 10){
      dd = '0' + dd;
  } 
  if(mm < 10){
      mm = '0'+ mm;
  }

  if(hh < 10){
    hh = '0' + hh;
  }

  if(min < 10){
    min = '0' + min;
  }

  if(ss < 10){
    ss = '0' + ss;
  }

  var today = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss;

  return today;
}