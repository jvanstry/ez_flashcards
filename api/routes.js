module.exports = function(app) {
  var questionList = require('./controllers/questionList');
  var result = require('./controllers/result');
  var home = require('./controllers/home')

  app.get('/', function(req, res){
    home.getHome(req, res);
  });
  app.route('/questions/:id')
    .get(questionList.nextQuestionList);
  app.route('/results')
    .get(result.getResults)
    .post(result.newResult);
};