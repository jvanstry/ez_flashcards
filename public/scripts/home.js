var timesThroughQuestionsLoop = 0;
var index = 0;
var questions = [];
var results = {
  correct: 0,
  total: 0
}

var getMoreQuestions = new Promise((resolve, reject) => {
  var questionsUrl = '/questions/1';
  spinnerUp();
  $.get(questionsUrl, function(retrievedQuestions){
    spinnerDown();
    resolve(retrievedQuestions)
  });
});

$(function(){
  getMoreQuestions.then((retrievedQuestions) => {
    questions = retrievedQuestions;
    questionLoop();
  });

  $('.tab').click(function(e){
      var data = $(e.target).data('panel');
      var panelToShowSelector = '#' + data + '-panel';

      if (data === 'progress'){
        $('#cards-panel').hide();
        $('#progress-panel').show();
        $('#cards-option').removeClass('active').addClass('inactive');
        $('#progress-option').removeClass('inactive').addClass('active');
        spinnerUp();
        $.get('/results', function(resp){
          var num = resp[resp.length - 1];
          var msg = resp.substring(0, resp.length - 1);
          console.log(resp);
          if( msg == 'success'){
            setTimeout(function(){
              spinnerDown();
              $('#progress-panel').html('<img src="images/temp' + num + '.png" />');
            }, 1000);
          }
        });
      }else{
        $('#progress-panel').hide();
        $('#cards-panel').show();
        $('#progress-option').removeClass('active').addClass('inactive');
        $('#cards-option').removeClass('inactive').addClass('active');
      }
  });
});

function questionLoop(){
  if(index >= 10){
    timesThroughQuestionsLoop++;
    postResults();

    var getNextBatchQuestions = new Promise((resolve, reject) => {
      var questionsUrl = '/questions/' + (1 + (10 * timesThroughQuestionsLoop));
      spinnerUp();
      $.get(questionsUrl, function(retrievedQuestions){
        spinnerDown();
        resolve(retrievedQuestions)
      });
    });

    getNextBatchQuestions.then((retrievedQuestions) => {
      index = 0;
      questions = retrievedQuestions;
      questionLoop();
    });  
  }else{
    var question = questions[index];
    var op1 = question.op1;
    var op2 = question.op2;

    updateOperands(op1, op2);
    setUpListeners();
  }
}

function postResults(){
  var resultsUrl = "/results";

  $.post(resultsUrl, results, function(res){
    console.log(res);
    results.correct = 0;
    results.total = 0;
  });
}

function updateOperands(op1, op2){
  var imageUrlOp1 = 'images/' + op1 + '.png';
  var imageUrlOp2 = 'images/' + op2 + '.png';

  $('#op1').attr('src', imageUrlOp1);
  $('#op2').attr('src', imageUrlOp2);
}

function setUpListeners(){
  $('#check-button').off('click');
  $('#clear-button').off('click');

  $('#check-button').one('click', handleAnswerSubmit);
  $('#clear-button').click(clearInput);
}

function handleAnswerSubmit(){
  var isCorrect = determineIfCorrect();
  fillAndBringUpFeedbackModal(isCorrect);
}

function determineIfCorrect(){
  var isCorrect = $('#answer').val() == questions[index]["answer"];

  if (isCorrect)
    results.correct++;

  results.total++;

  return isCorrect;
}

function fillAndBringUpFeedbackModal(isCorrect){
  var modalClass = isCorrect ? 'correct' : 'incorrect';
  var $feedbackModal = $('#grading-modal');

  $('#grading-op1').text(questions[index].op1);
  $('#grading-op2').text(questions[index].op2);
  $('#grading-wrong').text($('#answer').val());
  $('#grading-right').text(questions[index].answer);

  $feedbackModal.addClass(modalClass);

  $('#next-question').one('click', function(){
    $('#answer').val('');    
    $feedbackModal.removeClass(modalClass);
    $('#answer').focus();

    index++;
    questionLoop();
  });
}

function clearInput(){
  $('#answer').val('');
}

function spinnerUp(){

}

function spinnerDown(){

}





