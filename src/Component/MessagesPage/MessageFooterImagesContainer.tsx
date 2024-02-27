import React from "react";
import { Badge,IconButton,List, ListItem } from "@mui/material";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";

interface IMessageFooterImage {
  imageList: File[];
  deleteImage: (id: string) => void;
}

function MessageFooterImagesContainer({
  imageList,
  deleteImage,
}: IMessageFooterImage) {
  return (
    <List
      sx={{
        display: "flex",
        justifyContent: "center",
        position: "absolute",
        borderRadius: "10px",
        right: "20px",
        bottom: "80px",
        width: "300px",
        height: "70px",
        overflowX: "scroll",
        background: "rgba(0,0,0,0.3)",
        padding: "0px 10px",
      }}
    >
      {imageList.map((image) => (
        <Badge
          key={image.name}
          overlap="circular"
          badgeContent={
            <IconButton
              onClick={() => deleteImage(image.name)}
              sx={{ p: 0, m: 0 }}
            >
              <HighlightOffTwoToneIcon fontSize="small" />
            </IconButton>
          }
        >
          <ListItem>
            <img
              style={{ width: "50px", height: "50px" }}
              src={URL.createObjectURL(image)}
              alt={image.name}
            />
          </ListItem>
        </Badge>
      ))}
    </List>
  );
}

export { MessageFooterImagesContainer };
