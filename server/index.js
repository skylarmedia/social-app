const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
var admin = require('firebase-admin');

admin.initializeApp({
  apiKey: "AIzaSyB4seBRXpVJ3dZDfCddTWze8UCYEVZ8qkc",
  authDomain: "skylar-social-17190.firebaseapp.com",
  databaseURL: "https://skylar-social-17190.firebaseio.com",
  projectId: "skylar-social-17190",
  storageBucket: "skylar-social-17190.appspot.com",
  messagingSenderId: "861778122764",
  appId: "1:861778122764:web:682881979cd4294e"
});


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
});

app.listen(3001, () =>
  admin.auth().setCustomUserClaims('0BIWhNuYkwemKTkA3O9wxb6F3jG3', {admin: true}).then(() => {
    console.log('ran')
  })
);