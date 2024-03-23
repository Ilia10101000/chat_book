import React, { useEffect, useLayoutEffect } from "react";
import { CustomeInput } from "./CustomeInput";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { useFormik } from "formik";
import { Stack, TextField } from "@mui/material";
import {
  emailValidationSchema,
} from "../../lib/yupFormsValidationParams";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface IEmailForms {
  handleSubmit: (email: string, password: string) => void;
}

function EmailForms({ handleSubmit }: IEmailForms) {
  const [isShownPassword, setIsShownPassword] = useState(false);
  const { t, i18n } = useTranslation();

  const toogleVisibilityPassword = () => {
    setIsShownPassword((value) => !value);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: ({ email, password }) => {
      handleSubmit(email, password);
    },
    validationSchema: emailValidationSchema,
  });

  // useLayoutEffect(() => {
  //   Object.keys(formik.errors).forEach((fieldName) => {
  //     if (Object.keys(formik.touched).includes(fieldName)) {
  //       console.log(fieldName)
  //       formik.setFieldError(fieldName, formik.errors[fieldName])
  //     }
  //   });
  // },[formik.errors])

  // useEffect(() => {
  //   i18n.on("languageChanged", (lng) => {
  //     Object.keys(formik.errors).forEach((fieldName) => {
  //       if (Object.keys(formik.touched).includes(fieldName)) {
  //         console.log(fieldName)
  //         formik.setFieldError( [fieldName], t(formik.errors[fieldName]) );
  //       }
  //     });
  //   });
  //   return () => {
  //     i18n.off("languageChanged", (lng) => {});
  //   };
  // }, [formik.errors]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack
        direction="column"
        sx={{
          gap: 5,
          alignItems: "center",
        }}
      >
        <TextField
          sx={{ width: "250px" }}
          autoComplete="off"
          type={"text"}
          label={t("login.email")}
          id={"email"}
          name={"email"}
          helperText={formik.touched["email"] && formik.errors["email"]}
          error={formik.touched["email"] && Boolean(formik.errors["email"])}
          value={formik.values["email"]}
          onChange={formik.handleChange}
          onBlur={(e: any) => {
            const newFieldValue = e.target.value.trim().replace(/\s+/g, "");
            formik
              .setFieldValue("email", newFieldValue)
              .then(() => formik.handleBlur(e));
          }}
        />
        <TextField
          sx={{ width: "250px" }}
          autoComplete="off"
          type={!isShownPassword ? "password" : "text"}
          label={t("login.password")}
          id={"password"}
          name={"password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={toogleVisibilityPassword}>
                  {isShownPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          helperText={formik.touched["password"] && formik.errors["password"]}
          error={
            formik.touched["password"] && Boolean(formik.errors["password"])
          }
          value={formik.values["password"]}
          onChange={formik.handleChange}
          onBlur={(e: any) => {
            formik.handleBlur(e);
          }}
        />
        <Button
          color="secondary"
          type="submit"
          variant="contained"
          disabled={!formik.isValid}
        >
          {t("login.loginButton")}
        </Button>
      </Stack>
    </form>
  );
}

export { EmailForms };
