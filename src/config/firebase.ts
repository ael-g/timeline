import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAMtqF0uh_sVeM7DI4JcIqAoTBLlbTmwiQ",
    authDomain: "aelg-test.firebaseapp.com",
    databaseURL: "https://aelg-test.firebaseio.com",
    projectId: "aelg-test",
    storageBucket: "aelg-test.appspot.com",
    messagingSenderId: "235970089357",
    appId: "1:235970089357:web:08c07410f7554dda2b6dc4",
    measurementId: "G-L6NLVB99Y9"
  };

firebase.initializeApp(firebaseConfig);
const db=firebase.firestore();

export default db;