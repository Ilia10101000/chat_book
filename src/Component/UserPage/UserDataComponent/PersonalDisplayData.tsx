import React, { useState, useEffect } from "react";
import DefaultPhoto from "../../../img/default-user.svg";
import { useNavigate } from "react-router-dom";
import { Box, Button, Dialog, List, Typography } from "@mui/material";
import { ContactButton } from "./ContactButton";
import { User } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import EmailIcon from "@mui/icons-material/Email";
import { UserCard } from "../../FriendsPage/UserCard.tsx";

interface IPersonalDisplayData {
  isOwnPage: boolean;
  friendsList: any;
  postsCount: number;
  user: DocumentData;
  authUser: User;
}

function PersonalDisplayData({
  authUser,
  friendsList,
  postsCount,
  user,
  isOwnPage,
}: IPersonalDisplayData) {
  const [error, setError] = useState(null);
  const [isOpenFriendsDialog, setIsOpenFriendsDialog] = useState(false)
  const navigate = useNavigate();
  console.log(friendsList)

  const handleStartChat = () => {
    navigate(`/messages/${user?.id}`,{state:user});
  }

  const handleClickFrindsCard = (userId:string) => {
    navigate(`/u/${userId}`)
  }

  const toogleOpenFriendsDialog = () => {
    setIsOpenFriendsDialog(value => !value);
  }

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  }, [error]);

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
          <Typography
            variant="button"
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {postsCount || 0} Publications
          </Typography>
          <Typography
            onClick={toogleOpenFriendsDialog}
            variant="button"
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            {friendsList?.length || 0} Friends
          </Typography>
        </Box>
        {!isOwnPage && (
          <Box
            sx={{
              display: "flex",
              gap: "15px",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "start",
            }}
          >
            <Button
              startIcon={<EmailIcon />}
              size="small"
              variant="outlined"
              onClick={handleStartChat}
            >
              Start chat
            </Button>
            <ContactButton
              authUser={authUser}
              user={user}
              handleError={error}
            />
          </Box>
        )}
      </Box>
      <Dialog open={isOpenFriendsDialog} onClose={toogleOpenFriendsDialog}>
        <List sx={{ maxHeight:'70vh', maxWidth:'80vh', overflow:'scroll' }}>
          {friendsList.map(({ id }) => (
            <UserCard
              key={id}
              userId={id}
              handleClick={handleClickFrindsCard}
            />
          ))}
        </List>
      </Dialog>
    </Box>
  );
}

export { PersonalDisplayData };
