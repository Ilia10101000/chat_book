import { FormikProps, useFormik } from "formik";
import React, { createContext, useEffect, useContext } from "react";
import { newSigninValidationSchema } from "../../../lib/yupFormsValidationParams";
import { Outlet, useNavigate } from "react-router-dom";

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
    onSubmit: () => console.log(signinForm.values),

    validationSchema: newSigninValidationSchema,
  });

  console.log(signinForm);

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
