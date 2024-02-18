import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import User from "../../img/default-user.svg";
import { CustomTabPanel } from "../CustomeElement/CustomeTabPanel";
import { PersonalData } from "./PersonalData";
import { SecurityData } from "./SecurityData";
import { AccountData } from "./AccountData";

function Settings() {
  const { displayName, email, photoURL } = useAuth();
  const [tabNumber, setTabNumber] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabNumber(newValue);
  };

  return (
    <div style={{ width: "100%", padding: " 0px 50px" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabNumber} onChange={handleChange}>
          <Tab label="Personal Data" />
          <Tab label="Security" />
          <Tab label="Account" />
        </Tabs>
      </Box>
      <CustomTabPanel value={tabNumber} index={0}>
        <PersonalData displayName={displayName} photoURL={photoURL} />
      </CustomTabPanel>
      <CustomTabPanel value={tabNumber} index={1}>
        <SecurityData />
      </CustomTabPanel>
      <CustomTabPanel value={tabNumber} index={2}>
        <AccountData />
      </CustomTabPanel>
    </div>
  );
}

export { Settings };
