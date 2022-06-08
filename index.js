// Dependencies
const express = require('express');
const res = require('express/lib/response');
const OpenTok = require('opentok');
const app = express();
var invSessionId = false;

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
opentok.createSession({mediaMode:"routed"},function (err, session) {
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
    invSessionId: invSessionId
  });
  invSessionId = false;
});


app.get('/newsession', (req, res)=>{
  var sessionId = app.get('sessionId');

  // Generate a Token from the sessionId
  var token = opentok.generateToken(sessionId);
  invSessionId = false;


  // Renders Views (Sends HTML to client) + pass in variables: apiKey, sessionId, token
  res.render('session.ejs', {
    apiKey: apiKey,
    sessionId: sessionId,
    token: token
  });
});



app.post('/auth', function(req, res){
  //get sessionID from user
  var sessionId = req.body.sessionId;
  //generate token, needs to throw an error 
  
  try{
    var token = opentok.generateToken(sessionId);
    res.render('session.ejs', {
      apiKey: apiKey,
      sessionId: sessionId,
      token: token
    });
  }
  catch{
    res.redirect('/')
    invSessionId = true;
  }

  

})

app.post('/start', function(req, res){

  var archiveName = req.body.archiveName;
  
  opentok.startArchive(app.get('sessionId'), { name: archiveName }, function (
    err,
    archive
  ) {
    if (err) {
      return console.log(err);
    } else {
    
      console.log("new archive:" + archive.id);
      app.set('archiveId', archive.id);
    }
  });

  res.redirect('/newsession')
  
})

app.get('/stop', function(req, res){
  opentok.stopArchive(app.get('archiveId'), function (err, archive) {
    if (err) return console.log(err);
  
    console.log("Stopped archive:" + archive.id);
  });
  
  res.redirect('/newsession')
})

app.get('/archives', (req, res)=>{

  return res.render('archives.ejs',{
  })
})

app.get('/listarchives', (req, res)=>{
  opentok.listArchives( function (
    error,
    archives,
    totalCount
  ) {
    if (error) return console.log("error:", error);
  
    console.log(totalCount + " archives");

    for (var i = 0; i < archives.length; i++) {
      
      console.log(archives[i].id);
      
    }
    return res.render('archiveHistory.ejs',{
      archives: archives
    })
  });
  


});

app.post('/getarchive', function(req, res){
  var archiveId= req.body.archiveId;

  opentok.getArchive(archiveId, function (err, archive) {
    if (err) return res.send(500, 'Could not get archive ' + archiveId + '. error=' + err.message);
    return res.redirect(archive.url);
  });
})

app.post('/deletearchive', function(req, res){
  var archiveId= req.body.deleteArchive;

  opentok.deleteArchive(archiveId, function (err) {
    if (err) return res.send(500, 'Could not get archive ' + archiveId + '. error=' + err.message);

    return res.redirect("listarchives");
  });
 

  
})
