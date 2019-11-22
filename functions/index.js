const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firestore);

const updateClientStatus = (clientId, postId) => {
  return admin
    .firestore()
    .collection('users')
    .doc(clientId)
    .collection('posts')
    .doc(postId)
    .update({
      clientNotification: true
    });
};

exports.countUnread = functions.firestore
  .document('chats/{userId}/messages/{message}')
  .onCreate(doc => {
    const client = doc.data().client;
    const postId = doc.data().postId;
    const month = doc.data().month;
    console.log(doc.data());
    console.log('id', doc.id);
    if (doc.data().role == 'admin') {
      return updateClientStatus(client, postId);
    }
  });


// Update Client read messages
exports.readMonths = functions.https.onCall(data => {
  console.log('FINAL DATA', data);
  return admin
    .firestore()
    .collection('chats')
    .doc(data.userId)
    .collection('messages')
    .where('month', '==', data.month)
    .where('readByClient', '==', false)
    .where('admin', '==', true)
    .get();
});

exports.readClientMessages = functions.https.onCall(data => {
    console.log('RAN CLIENT MESSAGES')
    console.log('RAN CLIENT MESSAGES DATA', data)
  return admin
    .firestore()
    .collection('chats')
    .doc(data.userId)
    .collection('messages')
    .where('postId', '==', data.postId)
    .get()
    .then(snapshot => {
      let batch = admin.firestore().batch();
      console.log('batch', batch)
      snapshot.forEach(function(doc) {
        console.log('RES OF SNAP', doc);
      });
    });
});


// Get Previous Value of Messages in Months
exports.updateClientMessages = functions.https.onCall(data => {
  // console.log('DATA MONTH', data);
  return admin
    .firestore()
    .collection('chats')
    .doc('fblo')
    .collection('messages')
    .where('postId', '==', 'D5YZMfCuKstlATzFN5IZ')
    .get()
    .then(snapshot => {
      let batch = admin.firestore().batch();
      snapshot.docs.map(item => {
        console.log('item ID', item.id)
        const messageRef = admin
        .firestore()
        .collection('chats')
        .doc('fblo')
        .collection('messages')
        .doc(item.id)
        batch.update(messageRef,{readByClient:true})
      })
      return batch.commit();
    }).then(() => {
      console.log('SUCCESS')
    })
    .catch(err => {
      console.log(`error ${err}`)
    })
    // .then(snapshot => {

    //   console.log('batch', batch)
    //   snapshot.forEach(function(doc) {
    //     console.log('RES OF SNAP', doc);
    //   });
    // });
  // const docRef = admin
  // .firestore()
  // .collection("users")
  // .doc('fblo')
  // .collection('dates')
  // .where('month', '==', 11)
  // .get()
  // .then(function(snap){
  //   snap.docs.map(item => {
  //     return item.data().clientUnreadMessages
  //   })
  // });

  console.log('doc ref new', docRef)
});
