import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    ua: {
      translation: {
        login: {
          validEmail: "Введіть дійсну електронну адресу",
          required: "Обов'язкове поле",
          passswordMustMatch: "Паролі мають збігатися",
          minLen: "Мінімальна довжина – 6 літер",
          enterName: "Введіть ім'я",
          checkValue: 'Перевірте введене значення',
          name:"Ваше ім'я",

          loginButton: "Увійти",
          email: "Електронна адреса",
          password: "Пароль",
          createAccount: "Створити обліковий запис",
          forgotPassword: "Я забув свій пароль",
          google: "Увійти за допомогою Google",
        },
      },
    },
    eng: {
      translation: {
        login: {
          validEmail: "Enter a valid email",
          required: "Required",
          passswordMustMatch: "Passwords must match",
          minLen: "Min lenght is 6 letters",
          enterName: "Enter your name",
          checkValue: 'Check typed value',
          name:'Name',

          loginButton: "Login",
          email: "Email",
          password: "Password",
          createAccount: "Create account",
          forgotPassword: " I forgot password",
          google: "Login with Google",
        },
      },
    },
  },
  lng: "ua",
  fallbackLng: "ua",
  debug: true,
});

export default i18n;
