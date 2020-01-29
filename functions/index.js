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

// Update Client read messages on clientside
exports.readMonths = functions.https.onCall(data => {
  console.log('DATA IN CLIENT', data);
  console.log('TYPE OF DATA MONTH', typeof(data.month));
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

// exports.readMonthsAdmin = functions.https.onCall(data => {
//   return admin
//     .firestore()
//     .collection('chats')
//     .doc(data.userId)
//     .collection('messages')
//     .where('month', '==', data.month)
//     .where('readByAdmin', '==', false)
//     .where('admin', '==', false)
//     .get()
// });

// exports.readClientMessages = functions.https.onCall(data => {
//   return admin
//     .firestore()
//     .collection('chats')
//     .doc(data.userId)
//     .collection('messages')
//     .where('postId', '==', data.postId)
//     .get()
//     .then(snapshot => {
//       let batch = admin.firestore().batch();
//       snapshot.forEach(function(doc) {
//         console.log('RES OF SNAP', doc);
//       });
//     });
// });

// Update Home User Unread Messages
exports.updateHomeClientMessages = functions.https.onCall(data => {
  return admin
  .firestore()
  .collection('chats')
  .doc(data.userId)
  .collection('messages')
  .where('readByAdmin', '==', false)
  .get();
});

// Updat notification for Admin from Client
// exports.updateClientNotification  = functions.https.onCall(data => {
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

// Clear Client Messages
exports.changeUsername = functions.https.onCall(data => {
  return admin
    .auth()
    .updateUser(data.uid, {
      displayName: data.username
    })
    .then(() => {
      return admin
        .firestore()
        .collection('users')
        .doc(data.oldUsername)
        .get()
        .then(doc => {
          if (doc && doc.exists) {
            const data = doc.data();
            return admin
              .firestore()
              .collection('users')
              .doc(data.username)
              .set(data)
              .then(() => {
                admin
                  .firestore()
                  .collection('users')
                  .doc(data.oldUsername)
                  .delete();
              });
          }
        });
    })
    .catch(err => {
      return err;
    });
});

exports.clearClientMessages = functions.https.onCall(data => {
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
          .doc(item.id);
        batch.delete(messagesRef);
      });
      batch.commit();
    })
    .then(() => {
      return { message: 'Successfully deleted' };
    })
    .catch(err => {
      return err;
    });
});

//Create Admin

exports.createAdmin = functions.https.onCall(data => {
  admin
    .auth()
    .createUser({
      email: data.email,
      emailVerified: false,
      password: data.password,
      displayName: data.displayName,
      photoURL: data.photoURL,
      disabled: false
    })
    .then(function(userRecord) {
      var record = userRecord;
      console.log('RECORD', record)
      if (data.admin === true) {
        return admin
          .auth()
          .setCustomUserClaims(userRecord.uid, { skylarAdmin: true })
          .then(function(){
            console.log('record in record', record);
            return record;
          });
      } else {
        return admin.auth()
          .setCustomUserClaims(userRecord.uid, { skylarAdmin: false })
          .then(function(){
            return record;
          });
      }
    })
    .catch(function(err) {
      console.log('There was an error', err);
      return err;
    });
});

// Old create admin
// exports.createAdmin = functions.https.onCall(data => {
//   console.log("DATA ADMIn", data)
//   return admin.auth().setCustomUserClaims(data.uid, {skylarAdmin: data.isAdmin})
//   .then(res => {
//     console.log('RES in nodes', res)
//     return {
//       message: `Success ${res}`
//     }
//   })
//   .catch(err => {
//     return err
//   })
// });

//Get UID

exports.getUid = functions.https.onCall(data => {
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then(res => {
      return res;
    })
    .catch(err => {
      console.log(`There was an err ${err}`);
    });
});

// Delete User

exports.deleteByUid = functions.https.onCall(data => {
  return admin
    .firestore()
    .collection('users')
    .doc(data.name)
    .delete()
    .then(() => {
      admin.auth().deleteUser(data.uid);
    })
    .catch(err => {
      console.log(`Sorry there was an error: ${err}`);
    });
});

// Update Client Password

exports.changeClientPassword = functions.https.onCall(data => {
  return admin
    .auth()
    .updateUser(data.uid, {
      password: data.password
    })
    .catch(err => {
      return err;
    });
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
exports.updateAdminMessages = functions.https.onCall(data => {
  return admin
    .firestore()
    .collection('chats')
    .doc(data.userId)
    .collection('messages')
    .where('postId', '==', data.postId)
    .get()
    .then(snapshot => {
      let batch = admin.firestore().batch();
      snapshot.docs.map(item => {
        const messageRef = admin
        .firestore()
        .collection('chats')
        .doc(data.userId)
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
});
