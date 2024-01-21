import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// const firebaseConfig = {
//   apiKey: "AIzaSyAxcXFqSvFO0Ek7l3HaOrJK_AhpVqzdPIw",
//   authDomain: "chat-book-3205d.firebaseapp.com",
//   projectId: "chat-book-3205d",
//   storageBucket: "chat-book-3205d.appspot.com",
//   messagingSenderId: "322939136736",
//   appId: "1:322939136736:web:bb53a71dbbc9370ac3fe85",
// };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth,db}
