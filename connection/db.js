import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyA6ZPSFx9iPbqs5gqZzbXgDuMhBIBzjgm8",
    authDomain: "rclocacoes-9d7f5.firebaseapp.com",
    projectId: "rclocacoes-9d7f5",
    storageBucket: "rclocacoes-9d7f5.appspot.com",
    messagingSenderId: "328749941822",
    appId: "1:328749941822:web:df8a6479071829f6523d6f",
    measurementId: "G-6SPQKRJD6G"
};

// Initialize Firebase

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const storage = firebase.storage();

export { storage, firebase as default };

// banco

// const storage = firebase.storage();

// export { storage, firebase as default };