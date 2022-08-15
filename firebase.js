import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import firebase from 'firebase/compat/app';

const firebaseConfig = {
    databaseURL: 'https://signal-clone-yt-58f09.firebaseio.com',
    apiKey: "AIzaSyDjcySF4h7Qoi3UDwPEfVAfBVI2G4FtncE",
    authDomain: "signal-clone-yt-58f09.firebaseapp.com",
    projectId: "signal-clone-yt-58f09",
    storageBucket: "signal-clone-yt-58f09.appspot.com",
    messagingSenderId: "532442513195",
    appId: "1:532442513195:web:4ae1803ce0dc210cd04f6e"
};

let app;

if(firebase.apps.length === 0){
  app = firebase.initializeApp(firebaseConfig);
  firebase.firestore().settings({ experimentalForceLongPolling: true });
} else {
  app = firebase.app();
}

const db = app.firestore();

const auth = firebase.auth();

export { db,auth};