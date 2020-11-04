var firebaseConfig = {
    
    // Your API stuff goes here;  get it from firebase console
    apiKey: "AIzaSyDMMmMh6JXxbJ-_m2PxZJu7SRaDr3W2CcU",
    authDomain: "virtual-tours-d7758.firebaseapp.com",
    databaseURL: "https://virtual-tours-d7758.firebaseio.com",
    projectId: "virtual-tours-d7758",
    storageBucket: "virtual-tours-d7758.appspot.com",
    messagingSenderId: "786924163477",
    appId: "1:786924163477:web:aa2f43f0c5730296f4a69c"
    
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Create the Firestore database object
  // Henceforce, any reference to the database can be made with "db"
  const db = firebase.firestore();
