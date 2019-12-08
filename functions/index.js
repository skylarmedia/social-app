const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firestore);

// const updateClientStatus = (clientId, postId) => {
//   return admin
//     .firestore()
//     .collection('users')
//     .doc(clientId)
//     .collection('posts')
//     .doc(postId)
//     .update({
//       clientNotification: true
//     });
// };


// exports.countUnread = functions.firestore
//   .document('chats/{userId}/messages/{message}')
//   .onCreate(doc => {
//     const client = doc.data().client;
//     const postId = doc.data().postId;
//     const month = doc.data().month;
//     console.log(doc.data());
//     console.log('id', doc.id);
//     if (doc.data().role == 'admin') {
//       return updateClientStatus(client, postId);
//     }
//   });


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

exports.readMonthsAdmin = functions.https.onCall(data => {
  console.log('FINAL DATA', data);
  return admin
    .firestore()
    .collection('chats')
    .doc(data.userId)
    .collection('messages')
    .where('month', '==', data.month)
    .where('readByAdmin', '==', false)
    .where('admin', '==', false)
    .get()
});

// exports.readClientMessages = functions.https.onCall(data => {
//     console.log('RAN CLIENT MESSAGES')
//     console.log('RAN CLIENT MESSAGES DATA', data)
//   return admin
//     .firestore()
//     .collection('chats')
//     .doc(data.userId)
//     .collection('messages')
//     .where('postId', '==', data.postId)
//     .get()
//     .then(snapshot => {
//       let batch = admin.firestore().batch();
//       console.log('batch', batch)
//       snapshot.forEach(function(doc) {
//         console.log('RES OF SNAP', doc);
//       });
//     });
// });

// Update Home User Unread Messages
// exports.updateHomeClientMessages = functions.https.onCall(data => {
//   return admin
//   .firestore()
//   .collection('chats')
//   .doc(data.userId)
//   .collection('messages')
//   .where('readByAdmin', '==', false)
//   .get()
// })

// Updat notification for Admin from Client
// exports.updateClientNotification  = functions.https.onCall(data => {
//   console.log('data in client noticcation', data);
//   return admin
//   .firestore()
//   .collection('users')
//   .doc(data.userId)
//   .collection('posts')
//   .doc(data.postId)
//   .update({
//     adminNotification:true
//   })
// })

exports.clearClientMessages = functions.https.onCall(data => {
  console.log(`ran clientMessages clientId:${data.id}, postId: ${data.postId}`)
  console.log('post id', data)
  return admin
  .firestore()
  .collection('chats')
  .doc(data.id)
  .collection('messages')
  .where('postId', '==', data.postId)
  .get()
  .then(snapshot => {
    let batch = admin.firestore().batch();
    snapshot.docs.map(item => {
      const messagesRef = admin
      .firestore()
      .collection('chats')
      .doc(data.id)
      .collection('messages')
      .doc(item.id)
      batch.delete(messagesRef)
    })
    batch.commit()
  }).then(() => {
    console.log('Success')
  })
  .catch(err => {
    console.log(`error ${err}`)
  });
});


//Create Admin

exports.createAdmin = functions.https.onCall(data => {
  console.log(`data in uid${data.uid}`);
  console.log(`data ${data}`);
  admin.auth().setCustomUserClaims(data.uid, {skylarAdmin: true})
  .then((res) => {
    console.log(`res ${res} success`);
    return `this user has been created an admin`
   })
   .catch( err => {
     console.log(`Error`, err);
     return err
   })
});

//Get UID

exports.getUid = functions.https.onCall(data => {
  return admin.auth().getUserByEmail(data.email)
  .then(res => {
    console.log('res json', res.customClaims.skylarAdmin)
    return {isAdmin:res.customClaims.skylarAdmin}
  })
  .catch(err => {
    console.log(`There was an err ${err}`)
  })
});


// Delete User 

exports.deleteByUid = functions.https.onCall(data => {
  console.log(`DATA Whole: ${data}`)
  console.log(`Data ID: ${data.uid}`)
  console.log(`Data Name: ${data.name}`)
  return admin
  .firestore()
  .collection('users')
  .doc(data.name)
  .delete()
  .then(() => {
    console.log('Successfully Deleted from Firestore')
    admin.auth().deleteUser(data.uid)
  })
  .catch(err => {
    console.log(`Sorry there was an error: ${err}`)
  })
});

// // Update client messages by month
// exports.updateClientMessages = functions.https.onCall(data => {
//   return admin
//     .firestore()
//     .collection('chats')
//     .doc(data.userId)
//     .collection('messages')
//     .where('postId', '==', data.postId)
//     .get()
//     .then(snapshot => {
//       let batch = admin.firestore().batch();
//       snapshot.docs.map(item => {
//         console.log('item ID', item.id)
//         const messageRef = admin
//         .firestore()
//         .collection('chats')
//         .doc(data.userId)
//         .collection('messages')
//         .doc(item.id)
//         batch.update(messageRef,{readByAdmin:true})
//       })
//       return batch.commit();
//     }).then(() => {
//       console.log('SUCCESS')
//     })
//     .catch(err => {
//       console.log(`error ${err}`)
//     })
// });


// // Update Admin Messages
// exports.updateClientMessages = functions.https.onCall(data => {
//   return admin
//     .firestore()
//     .collection('chats')
//     .doc(data.userId)
//     .collection('messages')
//     .where('postId', '==', data.postId)
//     .get()
//     .then(snapshot => {
//       let batch = admin.firestore().batch();
//       snapshot.docs.map(item => {
//         console.log('item ID', item.id)
//         const messageRef = admin
//         .firestore()
//         .collection('chats')
//         .doc(data.userId)
//         .collection('messages')
//         .doc(item.id)
//         batch.update(messageRef,{readByClient:true})
//       })
//       return batch.commit();
//     }).then(() => {
//       console.log('SUCCESS')
//     })
//     .catch(err => {
//       console.log(`error ${err}`)
//     })
// });
