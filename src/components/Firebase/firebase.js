import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/functions';
import { runInThisContext } from 'vm';
// import addAdminRole from '../functions';
// import * as admin from "firebase-admin";

const config = {
  apiKey: 'AIzaSyB4seBRXpVJ3dZDfCddTWze8UCYEVZ8qkc',
  authDomain: 'skylar-social-17190.firebaseapp.com',
  databaseURL: 'https://skylar-social-17190.firebaseio.com',
  projectId: 'skylar-social-17190',
  storageBucket: 'skylar-social-17190.appspot.com',
  messagingSenderId: '861778122764',
  appId: '1:861778122764:web:682881979cd4294e'
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
    this.storage = app.storage();
    this.functions = app.functions();
  }

  // Admin Functions

  storage = this.storage;

  //***** Reactive Client *****//

  reactivateClient = id =>{
    alert(id)
    this.db
    .collection('users')
    .doc(id.toLowerCase().replace(/ /g, '-'))
    .update({
      archived: false
    });
  }

  getSinglePost = (userId, id) => {
    alert(id)
    this.db
    .collection('users')
    .doc('skylar-lanto')
    .collection('posts')
    .doc(id)
    .get()

  }
   

  getCurrentUser = () => {
    alert(this.auth.currentUser.uid);
  };

  listenChatChanges = id =>
    this.db
      .collection('chats')
      .doc(id)
      .collection('messages');

  // Post Approval

  approvePost = (userId, postId, approve) =>
    this.db
      .collection('users')
      .doc(userId)
      .collection('posts')
      .doc(postId)
      .update({
        approved: approve
      });



  

  getPostImages = () =>
    this.storage.refFromURL('gs://skylar-social-17190.appspot.com/test123/logo');

  getArchivedClients = () =>
    this.db
      .collection('users')
      .where('archived', '==', true)
      .get();

  //***** End Archive Functions ******/

  addLogoUrl = (user, logoUrl) =>
    this.db
      .collection('users')
      .doc(user)
      .add(
        {
          logoUrl: logoUrl
        },
        err => {
          console.log(err, 'err');
        }
      );

  getMessages = (id, month, day) =>
    this.db
      .collection('chats')
      .doc(id)
      .collection('messages')
      .where('month', '==', month)
      .where('day', '==', day)
      .get();

  sendCategories = (user, categories) => {
    categories.forEach(function(category) {
      console.log('category', category);
      app
        .firestore()
        .collection('users')
        .doc(user)
        .collection('categories')
        .doc(category.name)
        .set({
          categories: category
        });
    });
  };

  adminSendMessage = (id, month, day, title, message, logo) =>
    this.db
      .collection('chats')
      .doc(id)
      .collection('messages')
      .add({
        message,
        month,
        day,
        title,
        logo: logo,
        time: new Date().getTime()
      });

  getAdminPost = (user, postId) =>
    this.db
      .collection('users')
      .doc(user)
      .collection('posts')
      .doc(postId)
      .get();

  getAll = user =>
    this.db
      .collection('users')
      .doc(user)
      .get();

  getUserCategories = user =>
    this.db
      .collection('users')
      .doc(user)
      .collection('categories')
      .get();

  postMessage = (id, month, day, title, message) =>
    this.db
      .collection('chats')
      .doc(id)
      .collection('messages')
      .add({
        month: month,
        day: day,
        title: title,
        message: message,
        user: 'Admin',
        logo: 'https://skylarmedia.ca/wp-content/uploads/2018/12/SkylarMG_Icon_RGB-1.svg'
      });

  getUniqueClientPosts = (id, currentMonth) =>
    this.db
      .collection('users')
      .doc(id)
      .collection('posts')
      .where('month', '==', currentMonth)
      .get();

  deletePost = (id, postId) =>
    this.db
      .collection('users')
      .doc(id)
      .collection('posts')
      .doc(postId)
      .delete();

  getPostId = id =>
    this.db
      .collection('clients')
      .doc(id)
      .collection('posts');

  client = clientId => this.db.ref(`clients/${clientId}`);

  getSocialPosts = (id, month) =>
    this.db
      .collection('users')
      .doc(id)
      .collection('posts')
      .get();

  getClients = () =>
    this.db
      .collection('users')
      .where('archived', '==', false)
      .where('admin', '==', 0)
      .get();

  getPostId = id =>
    this.db
      .collection('clients')
      .doc(id)
      .collection('posts')
      .get();

  addClient = () => this.db.collection('clients');

  getDates = id =>
    this.db
      .collection('users')
      .doc(id)
      .collection('dates')
      .get();

  deleteDate = (user, id) =>
    this.db
      .collection('users')
      .doc(user)
      .collection('dates')
      .doc(id)
      .delete();

  // deleteDate = (user, year, month) => this.db.collection('users').doc(user).collection('dates').where('year', '==', year).where('month', '==', month).delete();

  addDate = (id, month, year) =>
    this.db
      .collection('users')
      .doc(id)
      .collection('dates')
      .add({
        month: month,
        year: year,
        private: true
      });

  getUID = urlName =>
    this.db
      .collection('users')
      .where('urlName', '==', urlName)
      .get();

  addUser = (email, password, name, logo) =>
    this.auth.createUserWithEmailAndPassword(email, password).then(user => {
      return this.db
        .collection('users')
        .doc(name.toLowerCase().replace(/ /g, '-'))
        .set({
          name: name,
          logo: logo,
          userId: user.user.uid,
          admin: 0,
          email: email,
          urlName: name.toLowerCase().replace(/ /g, '-'),
          archived: false
        });
    });

  updateCategories = (user, categories) => {
    categories.map(category => {
      this.db
        .collection('users')
        .doc(user)
        .collection('categories')
        .doc('JfldYWxlRlYj9kYzwpv3')
        .delete();
    });
  };

  // Posts Function

  editPostFirebase = (id, postId) =>
    this.db
      .collection('users')
      .doc(id)
      .collection('posts')
      .doc(postId)
      .get();

  editPostFirebase = (id, postId) =>
    this.db
      .collection('users')
      .doc(postId)
      .collection('posts')
      .doc(id)
      .get();
    
    

  editPostSubmit = (
    id,
    postId,
    editedTitle,
    postCopy,
    postHashtags,
    editedTime,
    links,
    selectedCategory
  ) =>
    this.db
      .collection('users')
      .doc(id)
      .collection('posts')
      .doc(postId)
      .update({
        title: editedTitle,
        copy: postCopy,
        hashtags: postHashtags,
        time: editedTime,
        links: links,
        selectedCategory
      });

  editReadAdmin = (user, postId, readValue) =>
    this.db
      .collection('users')
      .doc(user)
      .collection('posts')
      .doc(postId)
      .update({
        adminRead: readValue
      });

  editReadClient = (user, postId, readValue) =>
    this.db
      .collection('users')
      .doc(user)
      .collection('posts')
      .doc(postId)
      .update({
        clientRead: readValue
      });

  addPost = (
    id,
    post,
    draft,
    color,
    year,
    month,
    day,
    selectedCategoryName
  ) =>
    this.db
      .collection('users')
      .doc(id)
      .collection('posts')
      .add({
        post,
        draft,
        color,
        year,
        month,
        day,
        selectedCategoryName
      });

  // Get UID

  // End of posts functions

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password).then(res => {
      return this.db
        .collection('users')
        .where('email', '==', res.user.email)
        .get();
    });

  doSignOut = () =>
    this.auth.signOut().finally(() => {
      window.location.replace(process.env.PUBLIC_URL);
    });

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  writeUserData = (image, name) => {
    this.database()
      .ref()
      .set({
        image: image,
        name: name
      });
  };

  updatePost = (user, id, post) => {
    alert('updated')
    alert(id)
    this.db
    .collection('users')
    .doc(user)
    .collection('posts')
    .doc(id)
    .update({
      post:post
    })
  }

  removeCategory = (id, name) => {
    //   alert('ran removed');
    //   console.log('ran remove')
    this.db
      .collection('users')
      .doc(id)
      .collection('categories')
      .doc(name)
      .delete()
      .then(function() {
        console.log('Successfully Deleted');
      })
      .catch(err => {
        console.log('Err', err);
      });
  };

  user = uid =>
    this.db
      .collection('users')
      .doc(uid)
      .get();

  //***** Archive Client Functions *****//

  archiveClient = userId =>
    this.db
      .collection('users')
      .doc(userId)
      .update({
        archived: true
      })
      .then(() => {
        console.log('success');
      })
      .catch(err => {
        console.log('Err', err);
      });

  updatePrivate = (id, privacy, privateId) =>
    this.db
      .collection('users')
      .doc(id)
      .collection('dates')
      .doc(privateId)
      .update({
        private: privacy
      });

  deleteClient = id =>
    this.db
      .collection('users')
      .doc(id)
      .delete()

  getPrivacy = (id, year, month) =>
    this.db
      .collection('users')
      .doc(id)
      .collection('dates')
      .where('month', '==', month)
      .where('year', '==', year)
      .get();
}

export default Firebase;
