import React, { useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import AvatarEdit from "react-avatar-editor";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CheckIcon from "@mui/icons-material/Check";

interface IAvatarEditor {
  postsImage: File;
  handleSave: (editorRef: React.MutableRefObject<any>) => void;
}

const CustomeAvatarEditor = ({ postsImage, handleSave }: IAvatarEditor) => {
  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.between("xs", "md"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMdAndLarger = useMediaQuery(theme.breakpoints.up("md"));

  let editorSquardParams: number =
    (isXs && 250) || (isSm && 450) || (isMdAndLarger && 650);

  const [scaledImage, setScaledImage] = useState(1);

  const editorRef = useRef(null);

  const handleChangeScale = (e: Event, newValue: number) => {
    setScaledImage(newValue);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: "100%",
      }}
    >
      <AvatarEdit
        color={[0, 0, 0, 0.8]}
        ref={editorRef}
        image={postsImage}
        width={editorSquardParams}
        height={editorSquardParams}
        border={50}
        borderRadius={editorSquardParams / 2}
        scale={scaledImage}
      />
      <Stack spacing={3} direction="row" sx={{ mb: 1 }} alignItems="center">
        <div>
          <ZoomInIcon fontSize="small" />
          <Slider
            size="small"
            value={scaledImage}
            min={1}
            max={2}
            step={0.01}
            onChange={handleChangeScale}
            valueLabelDisplay="auto"
            sx={{ width: "100px" }}
          />
        </div>
      </Stack>
      <Button
        startIcon={<CheckIcon />}
        size="small"
        variant="contained"
        color="success"
        onClick={() => handleSave(editorRef)}
      >
        Submit
      </Button>
    </div>
  );
};
export { CustomeAvatarEditor };
