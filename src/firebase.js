import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {  
  apiKey: "AIzaSyD2cbK1l-qsaWDDdoLyEVb7be6BdGE7j5w",
  authDomain: "dquiz-7c3aa.firebaseapp.com",
  databaseURL: "https://dquiz-7c3aa-default-rtdb.firebaseio.com",
  projectId: "dquiz-7c3aa",
  storageBucket: "dquiz-7c3aa.appspot.com",
  messagingSenderId: "12579969468",
  appId: "1:12579969468:web:157aefa445fe487ac0b3b9",
  measurementId: "G-F29FP9S0CW"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
