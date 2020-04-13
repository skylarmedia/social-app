const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firestore);
const auth = admin.auth();


// Get All Users
exports.GetAuthUsers = functions.https.onCall(() => {
    let clients = auth.listUsers();
    return clients;
}, err => {
  return err;
});

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
    .catch(err => {
      if(err){
        return err;
      }
    })
    .then(function(userRecord) {
      var record = userRecord;
      console.log('RECORD', record)
      if (data.admin === true) {
        admin
          .auth()
          .setCustomUserClaims(userRecord.uid, { skylarAdmin: true })
          return record;
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
      return err
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
