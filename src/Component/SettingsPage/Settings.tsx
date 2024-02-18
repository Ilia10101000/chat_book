import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import User from "../../img/default-user.svg";
import { useFormik } from "formik";
import { CustomTabPanel } from "../CustomeElement/CustomeTabPanel";
import { newSigninValidationSchema as validationSchema } from "../../lib/yupFormsValidationParams";

function Settings() {
  const { displayName, email, photoURL } = useAuth();
  const [tabNumber, setTabNumber] = useState(0);
  // console.log(useAuth())

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabNumber(newValue);
  };

  // const profileFormValue = useFormik({
  //   initialValues: {
  //     displayName,
  //     photoURL,
  //     password: "",
  //     confirmPassword: "",
  //     email,
  //   },
  //   onSubmit: () => console.log(profileFormValue.values),

  //   validationSchema: validationSchema,
  // });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <img
        style={{
          width: "200px",
          height: "200px",
          borderRadius: "50%",
        }}
        src={photoURL || User}
        alt="avatar"
      />
      <TextField
        label={"Your name"}
      />
      <TextField
        label={"Your email"}
      />
      <TextField
        label={"Your password"}
      />
      <div style={{width:'100%', padding: ' 0px 50px'}}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabNumber}
            onChange={handleChange}
          >
            <Tab label="Personal Data" />
            <Tab label="Security" />
            <Tab label="Account" />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabNumber} index={0}>
          Item One
        </CustomTabPanel>
        <CustomTabPanel value={tabNumber} index={1}>
          Security
        </CustomTabPanel>
        <CustomTabPanel value={tabNumber} index={2}>
          Item Three
        </CustomTabPanel>
      </div>
    </div>
  );
}

export { Settings };
