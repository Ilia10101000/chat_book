import * as Yup from "yup";

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

const transformEmailValue = (value: string) => {
  return value.replace(/\s+/g, "");
};
const transformNameValue = (value: string) => {
  return value.trim().replace(/\s{2,}/g, " ");
};

const emailSchema = Yup.string()
  .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Enter a valid email")
  .required("Email is required");

const passwordSchema = Yup.string()
  .min(6, "Min lenght is 6 letters")
  .max(40, "Your password too long")
  .required("Set password for your account");

const phoneSchema = Yup.string()
  .min(18, "Enter valid phone")
  .matches(
    /^\+38\(0(99|98|97|96|95|94|93|68|67|66|63|50|39|94)\)-\d{3}-\d{2}-\d{2}$/,
    "Check your typed value"
  )
  .required("Phone is required");

const nameSchema = Yup.string()
  .min(2, "Enter your name")
  .matches(/^(?!-)(?!.*-\s*-)[A-Za-zА-Яа-яЁё -]+$/, "Check typed value")
  .required("Name is required");

const emailValidationSchema = Yup.object({
  email: emailSchema,
  password: passwordSchema,
}).shape({});

const newSigninValidationSchema = Yup.object({
  email: emailSchema,
  displayName: nameSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema
})

const loginValidationSchema = Yup.object({
  name: nameSchema,
}).shape({});

const phoneValidationSchema = Yup.object({
  phone: phoneSchema,
}).shape({});

const resetPasswordSchema = Yup.object({
  email: emailSchema,
});

const emailFormsList: Array<IFormsList> = [
  {
    label: "Email",
    name: "email",
    shouldTransform: {
      value: true,
      schema: transformEmailValue,
    },
    withMask: {
      value: false,
    },
  },
  {
    label: "Password",
    name: "password",
    shouldTransform: {
      value: false,
    },
    withMask: {
      value: false,
    },
  },
];

const resetPasswordFromList = [
  {
    label: "Email",
    name: "email",
    shouldTransform: {
      value: true,
      schema: transformEmailValue,
    },
    withMask: {
      value: false,
    },
  },
];

const loginFormList: Array<IFormsList> = [
  {
    label: "Name",
    name: "name",
    shouldTransform: {
      value: true,
      schema: transformNameValue,
    },
    withMask: {
      value: false,
    },
  },
];

const phoneFormList: Array<IFormsList> = [
  {
    label: "Phone",
    name: "phone",
    shouldTransform: {
      value: false,
    },
    withMask: {
      value: true,
      mask: "+38(099)-999-99-99",
    },
  },
];

export {
  emailValidationSchema,
  phoneValidationSchema,
  newSigninValidationSchema,
  resetPasswordSchema,
  emailFormsList,
  resetPasswordFromList,
  phoneFormList,
};
