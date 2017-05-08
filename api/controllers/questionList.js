var csv = require('csvtojson');
var path = require('path');
var pathToQuestions = path.join(__dirname, '../data/questions.csv');


exports.nextQuestionList = function(req, res, next) {
  var offset = parseInt(req.params.id) || 1;

  var questions = [];

  csv()
    .fromFile(pathToQuestions)
    .on('json',function(jsonLine){
      if(parseInt(jsonLine.id) >= offset && parseInt(jsonLine.id) < offset + 10){
        questions.push(jsonLine);
      }
    })
    .on('done',function(error){
      res.json(questions);

      next();
    });
};