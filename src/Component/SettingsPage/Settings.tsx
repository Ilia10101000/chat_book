import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";

function Settings() {

  const user = useAuth();

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
