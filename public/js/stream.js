
//Initialize Publisher
var publisher = OT.initPublisher();

//Initialize Session Object
var session = OT.initSession(apiKey, sessionId)


session.on({
  streamCreated: event => {
    session.subscribe(event.stream);
  },
  sessionConnected: event => {
    session.publish(publisher);
  },
});

  // Connect to Session
session.connect(token, (err) => {
  if (err) {
    console.log(`There was an error connecting to the session: ${err}`);
  }
});
