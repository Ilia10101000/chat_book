import React from "react";
import { TextField } from "@mui/material";
import User from "../../img/default-user.svg";

interface IPersonalData {
  displayName: string;
  photoURL: string;
}

function PersonalData({ displayName, photoURL }: IPersonalData) {

    // const [userName, setUserName] = useState('')
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "40px",
      }}
    >
      <img
        style={{
          width: "200px",
          height: "200px",
          borderRadius: "50%",
        }}
        src={photoURL || User}
        alt="avatar"
      />
      <TextField value={displayName} label={"Your name"} />
    </div>
  );
}

export { PersonalData };
