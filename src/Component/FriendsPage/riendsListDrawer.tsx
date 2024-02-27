import React, { useState, ReactNode } from "react";
import { Box, Divider, Typography, Drawer, Badge } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { CustomTabPanel } from "../CustomeElement/CustomeTabPanel";
import { useAuth } from "../../hooks/useAuth";
import { FriendsList } from "./FriendsList/FriendsList";
import { RequestList } from "./RequestList/RequestList";
import DrawerAppHeader from "../Drawers/DrawerAppHeader";

function FriendsListDrawer({ open, onClose, width }) {
  const user = useAuth();

  const authUserData = {
    id: user.uid,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
  const [tabNumber, setTabNumber] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabNumber(newValue);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{
        width: `${width + 50}px`,
        "& .MuiDrawer-paper": {
          width: `${width + 50}px`,
        },
      }}
    >
      <DrawerAppHeader>
        <Typography variant="h6" sx={{ mx: "auto" }}>
          <b>Friends</b>
        </Typography>
      </DrawerAppHeader>
      <Divider />
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs variant="fullWidth" value={tabNumber} onChange={handleChange}>
          <Tab label="Friends" />
          <Tab label="Request" />
        </Tabs>
      </Box>
      <CustomTabPanel style={{padding:"0px"}} value={tabNumber} index={0}>
        <FriendsList authUser={authUserData} onClose={onClose} />
      </CustomTabPanel>
      <CustomTabPanel value={tabNumber} index={1}>
        <RequestList authUser={authUserData} onClose={onClose} />
      </CustomTabPanel>
    </Drawer>
  );
}

export { FriendsListDrawer };