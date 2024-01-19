import React from "react";
import { auth } from "../../firebase/auth";
import {
  useSignInWithEmailAndPassword,
  useAuthState,
} from "react-firebase-hooks/auth";


function LoginPage() {
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);


  return (
    <button
      onClick={() =>
        signInWithEmailAndPassword("ilya.krasnoper@gmail.com", "123456")
      }
    >
      Login
    </button>
  );
}

export { LoginPage };
