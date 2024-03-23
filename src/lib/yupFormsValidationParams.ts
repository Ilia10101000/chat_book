import * as Yup from "yup";
import i18n from "../i18n";

interface IFormsList {
  label: string;
  name: string;
  shouldTransform: {
    value: boolean;
    schema?: (val: string) => string;
  };
  withMask: {
    value: boolean;
    mask?: string;
  };
}

Yup.setLocale({
  mixed: {
    required: "login.required",
  },
});

const transformEmailValue = (value: string) => {
  return value.replace(/\s+/g, "");
};
const transformNameValue = (value: string) => {
  return value.trim().replace(/\s{2,}/g, " ");
};

const emailSchema = Yup.string()
  .matches(
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    i18n.t("login.validEmail")
  )
  .required();
// .required(i18n.t("login.required"));

const passwordSchema = Yup.string()
  .min(6, i18n.t("login.minLen"))
  .required(i18n.t("login.required"));

const confirmPassword = Yup.string()
  .oneOf([Yup.ref("password"), null], i18n.t("login.passswordMustMatch"))
  .required(i18n.t("login.required"));

// const phoneSchema = Yup.string()
//   .min(18, "Enter valid phone")
//   .matches(
//     /^\+38\(0(99|98|97|96|95|94|93|68|67|66|63|50|39|94)\)-\d{3}-\d{2}-\d{2}$/,
//     "Check your typed value"
//   )
//   .required('Required');

const nameSchema = Yup.string()
  .min(2, i18n.t("login.enterName"))
  .matches(
    /^(?!-)(?!.*-\s*-)[A-Za-zА-Яа-яЁёЇїІіЄєҐґ -]+$/,
    i18n.t("login.checkValue")
  )
  .required(i18n.t("login.required"));

const emailValidationSchema = Yup.object({
  email: emailSchema,
  password: passwordSchema,
}).shape({});
const emailVerifySchema = Yup.object({
  email: emailSchema,
}).shape({});

const newSigninValidationSchema = Yup.object({
  email: emailSchema,
  displayName: nameSchema,
  password: passwordSchema,
  confirmPassword: confirmPassword,
});
const updatePasswordValidationSchema = Yup.object({
  password: passwordSchema,
  confirmPassword: confirmPassword,
});

const loginValidationSchema = Yup.object({
  displayName: nameSchema,
}).shape({});

const resetPasswordSchema = Yup.object({
  email: emailSchema,
});



export {
  emailValidationSchema,
  newSigninValidationSchema,
  resetPasswordSchema,
  loginValidationSchema,
  updatePasswordValidationSchema,
  emailVerifySchema,
};


