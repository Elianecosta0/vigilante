// firebaseConfig.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDDYCorp3feXt6iXdBxPcjHze5sixfTHc8",
  authDomain: "vigilante-37328.firebaseapp.com",
  projectId: "vigilante-37328",
  storageBucket: "vigilante-37328.appspot.com",
  messagingSenderId: "704323234417",
  appId: "1:704323234417:web:fa90c64b6e638cd63609d0",
  measurementId: "G-BD376GFZYT"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { firebase, auth, db, storage };
