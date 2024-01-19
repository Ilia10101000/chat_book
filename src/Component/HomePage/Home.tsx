import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/auth";
import { signOut } from "firebase/auth";


function HomePage() {
  const [user] = useAuthState(auth)
  return (
    <>
      <div>Home page</div>
      <button onClick={() => signOut(auth)}>Sign out</button>
      <div>{JSON.stringify(user, null, 2)}</div>
    </>
  );
}

export {HomePage}