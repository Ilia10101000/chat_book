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
import PersonPinIcon from "@mui/icons-material/PersonPin";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import BrushIcon from "@mui/icons-material/Brush";
import { AppTheme } from "./AppTheme";

function Settings() {
  const { displayName, photoURL, uid } = useAuth();
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

  const tabsList = [
    {
      label: "Personal Data",
      icon: <PersonPinIcon sx={{ fontSize: { xs: "25px", sm: "35px" } }} />,
    },
    {
      label: "Theme",
      icon: <BrushIcon sx={{ fontSize: { xs: "25px", sm: "35px" } }} />,
    },
    {
      label: "Security",
      icon: (
        <AdminPanelSettingsIcon sx={{ fontSize: { xs: "25px", sm: "35px" } }} />
      ),
    },
    {
      label: "Account",
      icon: (
        <ManageAccountsIcon sx={{ fontSize: { xs: "25px", sm: "35px" } }} />
      ),
    },
  ];

  return (
    <>
      <Box
        sx={{
          width: "100%",
          padding: {xs:0, sm:'0px 50px'},
        }}
      >
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            maxWidth: "100%",
          }}
        >
          <Tabs value={tabNumber} onChange={handleChange} variant="fullWidth">
            {tabsList.map(tab => <Tab sx={{fontSize:{xs:'9px', sm:'11px', md:'13px'}}} key={tab.label} icon={tab.icon} label={tab.label} />)}
          </Tabs>
        </Box>
        <Box>
          <CustomTabPanel value={tabNumber} index={0}>
            <PersonalData
              displayName={displayName}
              photoURL={photoURL}
              uid={uid}
              handleError={handleErrorOccured}
            />
          </CustomTabPanel>
          <CustomTabPanel value={tabNumber} index={1}>
            <AppTheme/>
          </CustomTabPanel>
          <CustomTabPanel value={tabNumber} index={2}>
            <SecurityData
              displayName={displayName}
              handleError={handleErrorOccured}
            />
          </CustomTabPanel>
          <CustomTabPanel value={tabNumber} index={3}>
            <AccountData handleError={handleErrorOccured} />
          </CustomTabPanel>
        </Box>
      </Box>
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
