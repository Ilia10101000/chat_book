import { ErrorPage } from "./Component/Error/Error";
import {
  unAuthorizedRoutes,
  authorizedRoutes,
  renderRoutes,
} from "./routes/routes";
import React, { createContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/auth";
import { Routes, Route } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { User } from "firebase/auth";

const UserContext = createContext<User>(null);

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  let availablePaths = user ? authorizedRoutes : unAuthorizedRoutes;

  if (loading) {
    return <CircularProgress color="success" />;
  }

  return (
    <UserContext.Provider value={user}>
      <Routes>
        {renderRoutes(availablePaths)}
        <Route path={"*"} element={<ErrorPage />} />
      </Routes>
    </UserContext.Provider>
  );
};

export { App, UserContext };

// {
//   "uid": "YEwV6IKNyFayKgJzQ7POerW3niI3",
//     "email": "ilya.krasnoper@gmail.com",
//     "emailVerified": true,
//     "displayName": "Илья Краснопёр",
//     "isAnonymous": false,
//     "photoURL": "https://lh3.googleusercontent.com/a/ACg8ocKoGFT38B7o5kHRGUUa9zVIhQuevXhuL2b7oG4SpPu2UVs=s96-c",
//     "providerData": [{ "providerId": "google.com", "uid": "107997698200320413714", "displayName": "Илья Краснопёр", "email": "ilya.krasnoper@gmail.com", "phoneNumber": null, "photoURL": "https://lh3.googleusercontent.com/a/ACg8ocKoGFT38B7o5kHRGUUa9zVIhQuevXhuL2b7oG4SpPu2UVs=s96-c" }],
//     "stsTokenManager": {
//       "refreshToken": "AMf-vBwRFRvEFxDpAVdudYSXBe2IYDFU2cGwFl2I-rN9MKjxAdR56s9BVZEgjr-OOsDtz_NEZhmNOw2B2MXIGSrQhmrefxvGq1q3Lv66Wa4tmUPukc1y004HQaIWtozjRXRnAb5Bm6wj13AqO03G8HHu_aXXUWdJ7V0iC6LSsoFHn4UGF4qSDgCxPkKgBXKafRnLNJIjE5eF9UcK_iR6o33wXW4OTVrLNtS4h9fiXRy-t8Bne31taw_tmAvTrLVkIIGrLe8G2n0s7Bf9LN5J-94LDMmUigJyiLB7Pzl_r3rC6PdigtiqAgE9vkzRqKo3Z7kOGlAnBVoed7JzURy8k_qIIiq9AC_3bQqp7cBYxjZFjMmichM79UvrukmovLCOKZ2oariXe9Y_XdCnlheKr56KyyX6xda0oUkhekqDCSGYL6bMjWB_6nCZKbHl4R6xod0f8motAa2E",
//         "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjY5NjI5NzU5NmJiNWQ4N2NjOTc2Y2E2YmY0Mzc3NGE3YWE5OTMxMjkiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoi0JjQu9GM0Y8g0JrRgNCw0YHQvdC-0L_RkdGAIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tvR0ZUMzhCN281a0hSR1VVYTl6VkloUXVldlhodUwyYjdvRzRTcFB1MlVWcz1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9jaGF0LWJvb2stMzIwNWQiLCJhdWQiOiJjaGF0LWJvb2stMzIwNWQiLCJhdXRoX3RpbWUiOjE3MDY4MDUzMjEsInVzZXJfaWQiOiJZRXdWNklLTnlGYXlLZ0p6UTdQT2VyVzNuaUkzIiwic3ViIjoiWUV3VjZJS055RmF5S2dKelE3UE9lclczbmlJMyIsImlhdCI6MTcwNjgwNTMyMSwiZXhwIjoxNzA2ODA4OTIxLCJlbWFpbCI6ImlseWEua3Jhc25vcGVyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTA3OTk3Njk4MjAwMzIwNDEzNzE0Il0sImVtYWlsIjpbImlseWEua3Jhc25vcGVyQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.JYOjTMldqfZepCsypY55ar7YvJCYRW6urPD61CKH4zMh7GGzKhiVa0IRqS49rFBnpygfzgwNC6fGavpTSE90MUlv7WbVl_O59F8DG3y407Yt6F5JjRGjmTHEIEbLGxmnIgKTl8Ic8n-dwvpLMLvm0oo-5qXapfS6iKh7REt7uMr9-8rUFDbEQ7lG_9hwzFpCZUUha5PbXsFUmrnXYNAB7899YqXb_c8TH4Tei7FSLMAJcZOkFOAPEOTaO61IogDTqc3tmuB-o386i3rulHZ24SHrtvbcLwr2Vp7GQr4tm1n3wZU4KrFru7dEL6xkf3O2u2YT_E2WRWM0lnzFIifGlw", "expirationTime": 1706808930277
//   }, "createdAt": "1705829432766", "lastLoginAt": "1706805321310", "apiKey": "AIzaSyAxcXFqSvFO0Ek7l3HaOrJK_AhpVqzdPIw", "appName": "[DEFAULT]"
// }
