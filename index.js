// Dependencies
const express = require('express');
const res = require('express/lib/response');
const OpenTok = require('opentok');
const app = express();

// My Project API info
const apiKey = "47512731";
const apiSecret = "8f9b78016ed88cf975be776f89e280a89dd8eccd";

// Create new instance 
var opentok = new OpenTok(apiKey, apiSecret);

app.use(express.static(__dirname + '/public')); 

app.use(express.urlencoded({
  extended: true
}))

// Create Session + Store in Express App
opentok.createSession(function (err, session) {
    if (err) return console.log(err);
    app.set('sessionId', session.sessionId);
  
    app.listen(3000, function () {
        console.log('Server listening on PORT 3000');
    });
});

app.get('/', function (req, res) {
  var sessionId = app.get('sessionId');

  // Generate a Token from the sessionId
  var token = opentok.generateToken(sessionId);


  // Renders Views (Sends HTML to client) + pass in variables: apiKey, sessionId, token
  res.render('index.ejs', {
  });
});


app.get('/newsession', (req, res)=>{
    var sessionId = app.get('sessionId');

  // Generate a Token from the sessionId
    var token = opentok.generateToken(sessionId);


  // Renders Views (Sends HTML to client) + pass in variables: apiKey, sessionId, token
  res.render('session.ejs', {
    apiKey: apiKey,
    sessionId: sessionId,
    token: token
  });
});

app.get('/archives', (req, res)=>{
    res.render('archives.ejs',{

    })
});

app.post('/auth', function(req, res){
    var sessionId = req.body.sessionId;
    var token = opentok.generateToken(sessionId);

    res.render('session.ejs', {
        apiKey: apiKey,
        sessionId: sessionId,
        token: token
      });

})
