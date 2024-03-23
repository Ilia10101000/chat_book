import React, { useState, ReactNode } from "react";
import { Box, Divider, Typography, Drawer, Badge } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { CustomTabPanel } from "../CustomeElement/CustomeTabPanel";
import { FriendsList } from "./FriendsList/FriendsList";
import { RequestList } from "./RequestList/RequestList";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { useAuth } from "../../App";
import { useTranslation } from "react-i18next";

function FriendsListDrawer({ open, onClose, receivedNewFriendsRequsts }) {
  const user = useAuth();

  const authUserData = {
    id: user.uid,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
  const [tabNumber, setTabNumber] = useState(0);
  const {t} = useTranslation()

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabNumber(newValue);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{
        backgroundColor: "background.paper",
        width: "250px",
        "& .MuiDrawer-paper": {
          width: "250px",
        },
      }}
    >
      <Divider />
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs variant="fullWidth" value={tabNumber} onChange={handleChange}>
          <Tab label={t("drawerInner.friends")} />
          <Tab
            label={t("friendsPage.request")}
            iconPosition="start"
            icon={
              receivedNewFriendsRequsts?.length ? (
                <PersonAddAlt1Icon
                  sx={{ fontSize: "18px", color: "#ce93d8" }}
                />
              ) : null
            }
          />
        </Tabs>
      </Box>
      <CustomTabPanel style={{ padding: "0px" }} value={tabNumber} index={0}>
        <FriendsList
          noMat={t("userPage.noMatches")}
          findFrie={t("friendsPage.find")}
          placeLabel={t("friendsPage.findFriends")}
          authUser={authUserData}
          onClose={onClose}
        />
      </CustomTabPanel>
      <CustomTabPanel style={{ padding: "0px" }} value={tabNumber} index={1}>
        <RequestList
          recLabel={t("friendsPage.received")}
          senLabel={t("friendsPage.sent")}
          authUser={authUserData}
          onClose={onClose}
        />
      </CustomTabPanel>
    </Drawer>
  );
}

export { FriendsListDrawer };
