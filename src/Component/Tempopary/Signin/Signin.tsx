import { useFormik, FormikConfig } from "formik";
import React, { ReactNode, createContext, useEffect, useContext } from "react";
import { newSigninValidationSchema } from "../../../lib/yupFormsValidationParams";
import { Outlet, useNavigate } from "react-router-dom";

const SigninContext = createContext<
  FormikConfig<{
    displayName: string;
    password: string;
    repeatPassword: string;
    photoURL: string;
    email: string;
  }>
>(null);

function Signin() {
const navigate = useNavigate()

  const signinForm = useFormik({
    initialValues: {
      displayName: "",
      photoURL: "",
      password: "",
      confirmPassword: "",
      email: "",
    },
      onSubmit: () => console.log(signinForm.values),
    
    validationSchema: newSigninValidationSchema,
  });
    
    useEffect(() => {
        navigate('/signin/displayName')
    },[])

  return (
    // <SigninContext.Provider value={signinForm}>
    //   {children}
      // </SigninContext.Provider>
      <Outlet context={signinForm}/>
  );
}

export { Signin };

// function useSigninValue() {
//   return useContext(SigninContext);
// }

// export { useSigninValue };