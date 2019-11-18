const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.createNotification = functions.firestore
.document('chats/{user}/messages')
.onCreate((snap, context) => {
    console.log(`snapshot of db :${snap}, context: ${context}`)
})