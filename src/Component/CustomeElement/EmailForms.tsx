import React, { useEffect } from "react";
import { CustomeInput } from "./CustomeInput";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { useFormik } from "formik";
import { Stack } from "@mui/material";
import {
  emailValidationSchema,
  emailFormsList,
} from "../../lib/yupFormsValidationParams";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

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

    useEffect(() => {
      i18n.on("languageChanged", (lng) => {
        Object.keys(formik.errors).forEach((fieldName) => {
          if (Object.keys(formik.touched).includes(fieldName)) {
            formik.setFieldTouched(fieldName);
          }
        });
      });
      return () => {
        i18n.off("languageChanged", (lng) => {});
      };
    }, [formik.errors]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack
        direction="column"
        sx={{
          gap: 5,
          alignItems: "center",
        }}
      >
        {emailFormsList.map((form) => (
          <CustomeInput
            autoComplete="off"
            type={
              form.name === "password" && !isShownPassword ? "password" : "text"
            }
            label={form.label}
            id={form.name}
            name={form.name}
            InputProps={
              form.name === "password"
                ? {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toogleVisibilityPassword}>
                          {isShownPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                : null
            }
            helperText={formik.touched[form.name] && formik.errors[form.name]}
            error={
              formik.touched[form.name] && Boolean(formik.errors[form.name])
            }
            value={formik.values[form.name]}
            onChange={formik.handleChange}
            onBlur={(e: any) => {
              if (form.shouldTransform.value) {
                const { schema } = form.shouldTransform;
                formik
                  .setFieldValue(form.name, schema && schema(e.target.value))
                  .then(() => formik.handleBlur(e));
              } else {
                formik.handleBlur(e);
              }
            }}
            mask={form.withMask.value ? form.withMask.mask : null}
            key={form.name}
          />
        ))}
        <Button
          color="secondary"
          type="submit"
          variant="contained"
          disabled={!formik.isValid}
        >
          {t('login.loginButton')}
        </Button>
      </Stack>
    </form>
  );
}

export { EmailForms };
