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
  return Firebase.initializeApp(firebaseConfig);
};

export const login = async function (email, password) {
  let userCredential = await Firebase.auth().signInWithEmailAndPassword(email, password);
  return {
    email: userCredential.user.email,
    name: userCredential.user.displayName,
    uid: userCredential.user.uid,
  };
};

export const logout = async function () {
  await Firebase.auth().signOut();
};
