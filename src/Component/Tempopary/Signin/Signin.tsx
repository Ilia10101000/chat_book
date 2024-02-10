import { FormikProps, useFormik } from "formik";
import React, { createContext, useEffect, useContext, useState } from "react";
import { newSigninValidationSchema } from "../../../lib/yupFormsValidationParams";
import { Outlet } from "react-router-dom";
import { 
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { storage, ref, auth } from "../../../firebase/auth";
import { getDownloadURL, uploadString } from "firebase/storage";


const SigninContext = createContext<{
  signinForm: FormikProps<{
    displayName: string;
    photoURL: string;
    password: string;
    confirmPassword: string;
    email: string;
  }>,
  error:string | null
}>(null);

function Signin() {

  const [error, setError] = useState<string | null>(null);

  const signinForm = useFormik({
    initialValues: {
      displayName: localStorage.getItem("displayNameSignInValue") || "",
      photoURL: localStorage.getItem("photoURLSignInValue") || "",
      password: "",
      confirmPassword: "",
      email: localStorage.getItem("emailSignInValue") || "",
    },
    onSubmit: async () => {
      if (error) {
        setError(null)
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
            ref(storage, `avatar/${userCredentials.user.uid}/avatar`),
            photoURL,
            "data_url"
          );
          const photourl = await getDownloadURL(
            ref(storage, `avatar/${userCredentials.user.uid}/avatar`)
          );
          await updateProfile(auth.currentUser, {
            displayName,
            photoURL: photourl,
          });
        }
      } catch (error) {
        setError(error.message);
      }
    },

    validationSchema: newSigninValidationSchema,
  });

  useEffect(() => {
    return () => {
      localStorage.removeItem("photoURLSignInValue");
      localStorage.removeItem("emailSignInValue");
      localStorage.removeItem("displayNameSignInValue");
    }
  },[])
  return (
    <SigninContext.Provider value={{signinForm,error}}>
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
