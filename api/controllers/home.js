var question = require('../models/question')

exports.getHome = function(req, res) {
  res.render('home', { title: 'EZ Flashcards'});
};