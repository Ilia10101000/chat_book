import React, { useContext, useState } from "react";
import { Box, TextField } from "@mui/material";
import { UserContext } from "../../App";

function Settings() {

  const user = useContext(UserContext);

  const [userName, setUserName] = useState(user.displayName ||'');
  const [photoURL, setPhotoURL] = useState(user.photoURL || '')

  return (
    <div>
      <TextField value={userName} onChange={e => setUserName(e.target.value)} label={'Your name'} />
      <div></div>
    </div>
  );
}

export { Settings };
