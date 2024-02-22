import { FormikProps, useFormik } from "formik";
import React, { createContext, useEffect, useContext, useState } from "react";
import { newSigninValidationSchema } from "../../lib/yupFormsValidationParams";
import { Outlet } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { storage, ref, auth, db } from "../../firebase/auth";
import { getDownloadURL, uploadString } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { USERS, AVATAR } from "../../firebase_storage_path_constants/firebase_storage_path_constants";

const SigninContext = createContext<{
  signinForm: FormikProps<{
    displayName: string;
    photoURL: string;
    password: string;
    confirmPassword: string;
    email: string;
  }>;
  error: string | null;
  loading: boolean;
}>(null);

function Signin() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signinForm = useFormik({
    initialValues: {
      displayName: localStorage.getItem("displayNameSignInValue") || "",
      photoURL: localStorage.getItem("photoURLSignInValue") || "",
      password: "",
      confirmPassword: "",
      email: localStorage.getItem("emailSignInValue") || "",
    },
    onSubmit: async () => {
      setLoading(true);
      if (error) {
        setError(null);
      }
      try {
        const { displayName, photoURL, password, email } = signinForm.values;

        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (photoURL) {
          await uploadString(
            ref(storage, `${AVATAR}/${userCredentials.user.uid}/${AVATAR}`),
            photoURL,
            "data_url"
          );
          const photourlLink = await getDownloadURL(
            ref(storage, `${AVATAR}/${userCredentials.user.uid}/${AVATAR}`)
          );
          await updateProfile(auth.currentUser, {
            displayName,
            photoURL: photourlLink,
          });
          await setDoc(doc(db, USERS, userCredentials.user.uid), {
            id: userCredentials.user.uid,
            displayName,
            email,
            photoURL: photourlLink,
          });
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },

    validationSchema: newSigninValidationSchema,
  });

  useEffect(() => {
    return () => {
      localStorage.removeItem("photoURLSignInValue");
      localStorage.removeItem("emailSignInValue");
      localStorage.removeItem("displayNameSignInValue");
    };
  }, []);
  return (
    <SigninContext.Provider value={{ signinForm, error, loading }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
          paddingTop: "40px",
          width: "100%",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </div>
    </SigninContext.Provider>
  );
}

export { Signin };

function useSigninValue() {
  return useContext(SigninContext);
}

export { useSigninValue };
