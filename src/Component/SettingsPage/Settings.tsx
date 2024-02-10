import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import User from '../../img/default-user.svg'
import { useFormik } from "formik";
import { newSigninValidationSchema as validationSchema } from "../../lib/yupFormsValidationParams";

function Settings() {

  const { displayName, email, photoURL } = useAuth();
  console.log(useAuth())
  
  const profileFormValue = useFormik({
    initialValues: {
      displayName,
      photoURL,
      password: "",
      confirmPassword: "",
      email,
    },
    onSubmit: () => console.log(profileFormValue.values),

    validationSchema: validationSchema,
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <img style={{
        width: '200px',
        height: '200px',
        borderRadius:'50%'
      }} src={photoURL || User} alt="avatar" />
      <TextField
        value={profileFormValue.values.displayName}
        onChange={profileFormValue.handleChange}
        label={"Your name"}
      />
      <TextField
        value={profileFormValue.values.email}
        onChange={profileFormValue.handleChange}
        label={"Your email"}
      />
      <TextField
        value={profileFormValue.values.password}
        onChange={profileFormValue.handleChange}
        label={"Your password"}
      />
      <div></div>
    </div>
  );
}

export { Settings };
