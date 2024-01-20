import React from "react";
import { auth, db } from "../../firebase/auth";
import {
  useSignInWithEmailAndPassword,
  useCreateUserWithEmailAndPassword
} from "react-firebase-hooks/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";


function LoginPage() {
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [createUser] = useCreateUserWithEmailAndPassword(auth);



  return (
    <>
    <button
      onClick={() =>
        signInWithEmailAndPassword("ilya.krasnoper@gmail.com", "123456")
      }
    >
      Login
      </button>
      <button onClick={async () => {
        try {
          const credentials = await createUser('kat.gar@gmail.com', '123456');
  
          const userDocRef = doc(db, "users", (credentials?.user?.uid || 'defaultUser'));
  
          await setDoc(userDocRef, {
            uid: credentials?.user.uid,
            email: credentials?.user.email,
            emailVerified: credentials?.user.emailVerified,
            displayName:
              credentials?.user.providerData[0].displayName ||
              "User: " + credentials?.user?.uid.slice(0,4),
          })
          
        } catch (error:any) {
          console.log(error.message)
        }

      }}>Create</button>
    </>
  );
}

export { LoginPage };
