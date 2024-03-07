import React, { useState } from "react";
import { DocumentData } from "firebase/firestore";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { CustomTabPanel } from "../../CustomeElement/CustomeTabPanel";
import { OwnPosts } from "./PostsCollection";
import { ThirdPartyPosts } from "./ThirdPartyPosts";

interface IPosList {
  postsList: DocumentData[];
  thirdPartyPostTags:any;
  user: any;
}

function PostList({ postsList, thirdPartyPostTags }: IPosList) {

  const [tabNumber, setTabNumber] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabNumber(newValue);
  };
  return (
    <Box sx={{ maxWidth: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabNumber} onChange={handleChange}>
          <Tab label="Posts" />
          <Tab label="Marks" />
        </Tabs>
      </Box>
      <CustomTabPanel
        style={{ padding: "5px", overflowY: "hidden" }}
        value={tabNumber}
        index={0}
      >
        <OwnPosts posts={postsList} />
      </CustomTabPanel>
      <CustomTabPanel value={tabNumber} index={1}>
        <ThirdPartyPosts postTagsList={thirdPartyPostTags} />
      </CustomTabPanel>
    </Box>
  );
}

export { PostList };
