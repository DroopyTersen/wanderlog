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

export const intialize = function () {
  console.log("intialize -> intialize", firebaseConfig);
  return Firebase.initializeApp(firebaseConfig);
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

const parseUser = function (user: Firebase.User) {
  if (!user) return null;
  return {
    email: user.email,
    name: user.displayName,
    uid: user.uid,
    metadata: user.metadata,
    photoURL: user.photoURL,
    phoneNumber: user.phoneNumber,
  };
};
