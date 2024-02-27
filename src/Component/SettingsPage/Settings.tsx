import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { CustomTabPanel } from "../CustomeElement/CustomeTabPanel";
import { PersonalData } from "./PersonalData/PersonalData";
import { SecurityData } from "./SecurityData/SecurityData";
import { AccountData } from "./AccountData";
import Alert from "@mui/material/Alert";

function Settings() {
  const { displayName, email, photoURL, uid } = useAuth();
  const [error, setError] = useState("");
  const [tabNumber, setTabNumber] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabNumber(newValue);
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  });

  const handleErrorOccured = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <>
      <div style={{ width: "100%", padding: " 0px 50px" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabNumber} onChange={handleChange}>
            <Tab label="Personal Data" />
            <Tab label="Security" />
            <Tab label="Account" />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabNumber} index={0}>
          <PersonalData
            displayName={displayName}
            photoURL={photoURL}
            uid={uid}
            handleError={handleErrorOccured}
          />
        </CustomTabPanel>
        <CustomTabPanel value={tabNumber} index={1}>
          <SecurityData displayName={displayName} handleError={handleErrorOccured} />
        </CustomTabPanel>
        <CustomTabPanel value={tabNumber} index={2}>
          <AccountData handleError={handleErrorOccured} />
        </CustomTabPanel>
      </div>
      {error && (
        <Alert
          sx={{ maxWidth: "250px", mx: "auto", mt: 1 }}
          variant="outlined"
          severity="error"
        >
          {error}
        </Alert>
      )}
    </>
  );
}

export { Settings };
