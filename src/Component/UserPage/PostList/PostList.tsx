import { ImageList } from "@mui/material";
import { DocumentData } from "firebase/firestore";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { CustomTabPanel } from "../../CustomeElement/CustomeTabPanel";
import { OwnPosts } from "./OwnPosts";

interface IPosList {
  postsList: DocumentData[];
  userId: string;
}

function PostList({ postsList, userId }: IPosList) {
  const [tabNumber, setTabNumber] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabNumber(newValue);
  };
  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabNumber} onChange={handleChange}>
          <Tab label="Posts" />
          <Tab label="Joint photos" />
        </Tabs>
      </Box>
      <CustomTabPanel style={{padding:'5px'}} value={tabNumber} index={0}>
        <OwnPosts userId={userId} posts={postsList} />
      </CustomTabPanel>
      <CustomTabPanel value={tabNumber} index={1}>
        2
      </CustomTabPanel>
    </Box>
  );
}

export { PostList };
