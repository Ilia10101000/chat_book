import React, { useState, useEffect } from "react";
import DefaultPhoto from "../../../img/default-user.svg";
import { Link } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { ContactButton } from "./ContactButton";
import { User } from "firebase/auth";
import { DocumentData } from "firebase/firestore";


interface IPersonalDisplayData {
  isOwnPage: boolean;
  friendsCount: number,
  postsCount: number
  user: DocumentData;
  authUser: User;
}

function PersonalDisplayData({
  authUser,
  friendsCount,
  postsCount,
  user,
  isOwnPage,
}: IPersonalDisplayData) {
  
  const [handleError, setHandleError] = useState(null);

  useEffect(() => {
    if (handleError) {
      setTimeout(() => {
        setHandleError(null);
      }, 2000);
    }
  }, [handleError]);


  return (
    <Box sx={{ display: "flex", py: 3 }}>
      <div style={{ margin: "0px 40px 0px 20px", width: "150px" }}>
        <img style={{ width: "100%" }} src={user.photoURL || DefaultPhoto} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <div>{user.displayName}</div>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <div>{postsCount || 0} Publications</div>
          <div>{friendsCount || 0} Friends</div>
        </div>
        {!isOwnPage && (
          <div style={{ display: "flex", gap: "15px" }}>
            <Link to={`/messages/${user.id}`} state={user}>
              <Button size="small" variant="contained">
                Start chat
              </Button>
            </Link>
            <ContactButton
              authUser={authUser}
              user={user}
              handleError={handleError}
            />
          </div>
        )}
      </div>
    </Box>
  );
}

export { PersonalDisplayData };
