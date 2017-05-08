var csv = require('csvtojson');
var pathToQuestions = '../data/questions.csv';

exports.getQuestions = function(startingPoint){
  var offset = 0;

  if(startingPoint){
    offset += parseInt(startingPoint);
  }

  var questions = [];

  csv()
    .fromFile(pathToQuestions)
    .on('json',function(jsonLine){
      if(jsonLine.id > offset && jsonLine < offset + 10)
        questions.push(jsonLine);
    })
    .on('done',function(error){
      return questions;
    })
}