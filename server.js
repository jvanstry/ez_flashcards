var express = require('express'),
  app = express(),
  port = process.env.PORT || 4114,
  Question = require('./api/models/question'),
  Result = require('./api/models/result'),
  bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var apiRoutes = require('./api/routes');
apiRoutes(app);

app.listen(port);


console.log('todo list RESTful API server started on: ' + port);