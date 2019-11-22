const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firestore);

const updateClientStatus = ((clientId, postId) => {
    return admin.firestore()
    .collection('users')
    .doc(clientId)
    .collection('posts')
    .doc(postId)
    .update({
        clientNotification:true
    });
})

exports.countUnread = functions.firestore
.document('chats/{userId}/messages/{message}')
.onCreate((doc)=> {
    const client = doc.data().client;
    const postId = doc.data().postId;
    const month = doc.data().month;
    console.log(doc.data())
    console.log('id', doc.id)
    if(doc.data().role == 'admin'){
        return updateClientStatus(client, postId)
    }
});

exports.readMonths = functions.https.onCall((data) => {
    console.log('FINAL DATA', data)
    return admin.firestore()
    .collection('chats')
    .doc(data.userId)
    .collection('messages')
    .where('month', '==', data.month)
    .where('read', '==', false)
    .get()
})

