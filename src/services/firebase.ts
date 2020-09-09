import * as Firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyD8fs6klc71Y0CFaEPchqGT3q_NCcpYdAU",
  authDomain: "wanderlogapp.firebaseapp.com",
  databaseURL: "https://wanderlogapp.firebaseio.com",
  projectId: "wanderlogapp",
  storageBucket: "wanderlogapp.appspot.com",
  messagingSenderId: "718624996813",
  appId: "1:718624996813:web:99b364ae1716c158179884",
  measurementId: "G-QGDEZVCCGP",
};

let app: Firebase.app.App = null;
export const getApp = () => app;

export const intialize = function (): Firebase.app.App {
  console.log("intialize -> intialize", firebaseConfig);
  app = Firebase.initializeApp(firebaseConfig);
  app
    .firestore()
    .enablePersistence()
    .catch(function (err) {
      if (err.code == "failed-precondition") {
        alert("Multiple tabs open, persistence can only be enabled in one tab at a a time.");
      } else if (err.code == "unimplemented") {
        console.log(
          "The current browser does not support all of the features required to enable persistence"
        );
      }
    });
  return app;
};

export const getCurrentUser = async function () {
  let user = await Firebase.auth().currentUser;
  return parseUser(user);
};

export const login = async function (email, password) {
  let userCredential = await Firebase.auth().signInWithEmailAndPassword(email, password);
  console.log("userCredential", userCredential);
  return parseUser(userCredential.user);
};

export const logout = async function () {
  await Firebase.auth().signOut();
};

export const onAuthChange = (cb) => Firebase.auth().onAuthStateChanged(cb);

const parseUser = function (user: Firebase.User) {
  if (!user) return null;
  return {
    email: user.email,
    displayName: user.displayName,
    uid: user.uid,
    photoURL: user.photoURL,
  };
};
