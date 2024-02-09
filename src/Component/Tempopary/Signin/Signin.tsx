import { FormikProps, useFormik } from "formik";
import React, { createContext, useEffect, useContext } from "react";
import { newSigninValidationSchema } from "../../../lib/yupFormsValidationParams";
import { Outlet } from "react-router-dom";
import { 
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { storage, ref, auth } from "../../../firebase/auth";
import { getDownloadURL, uploadString } from "firebase/storage";


const SigninContext = createContext<
  FormikProps<{
    displayName: string;
    photoURL: string;
    password: string;
    confirmPassword: string;
    email: string;
  }>
>(null);

function Signin() {

  const signinForm = useFormik({
    initialValues: {
      displayName: localStorage.getItem("displayNameSignInValue") || "",
      photoURL: localStorage.getItem("photoURLSignInValue") || "",
      password: "",
      confirmPassword: "",
      email: localStorage.getItem("emailSignInValue") || "",
    },
    onSubmit: async () => {
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
        console.log("4000$");
        throw new Error(error.message);
      }
    },

    validationSchema: newSigninValidationSchema,
  });

  useEffect(() => {
    return () => {
      localStorage.removeItem('photoURL')
      localStorage.removeItem('email')
      localStorage.removeItem("displayNameSignInValue");
      localStorage.removeItem("password");
    }
  },[])
  return (
    <SigninContext.Provider value={signinForm}>
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
