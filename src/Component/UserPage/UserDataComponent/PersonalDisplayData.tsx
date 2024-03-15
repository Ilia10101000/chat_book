import React, { useState, useEffect } from "react";
import DefaultPhoto from "../../../img/default-user.svg";
import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { ContactButton } from "./ContactButton";
import { User } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import EmailIcon from "@mui/icons-material/Email";

interface IPersonalDisplayData {
  isOwnPage: boolean;
  friendsCount: number;
  postsCount: number;
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
    <Box sx={{ display: "flex", gap: "20px", py: 3, maxWidth: "100%" }}>
      <Box
        sx={{
          margin: "0px 0px 0px 20px",
          width: { xs: "150px", sm: "250px" },
        }}
      >
        <img
          style={{
            width: "100%",
            borderRadius: "50%",
            backgroundColor: "#000",
          }}
          src={user?.photoURL || DefaultPhoto}
        />
      </Box>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "50%",
          overflow: "hidden",
          flexShrink: 1,
        }}
      >
        <Typography
          sx={{
            maxWidth: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          variant="h6"
        >
          {user?.displayName}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: { xs: "10px", sm: "20px" },
            maxWidth: "100%",
            overflow: "hidden",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <div
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {postsCount || 0} Publications
          </div>
          <div
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {friendsCount || 0} Friends
          </div>
        </Box>
        {!isOwnPage && (
          <Box
            sx={{
              display: "flex",
              gap: "15px",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Link to={`/messages/${user?.id}`} state={user}>
              <Button startIcon={<EmailIcon />} size="small" variant="outlined">
                Start chat
              </Button>
            </Link>
            <ContactButton
              authUser={authUser}
              user={user}
              handleError={handleError}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export { PersonalDisplayData };
