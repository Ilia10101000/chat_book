import React, { useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import AvatarEdit from "react-avatar-editor";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CheckIcon from "@mui/icons-material/Check";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { useTranslation } from "react-i18next";

interface IAvatarEditor {
  postsImage: File;
  handleSave: (editorRef: React.MutableRefObject<any>) => void;
}

const ratios = [
  { label: "1:1", value: 1 },
  { label: "5:4", value: 1.25 },
  { label: "16:9", value: 1.77 },
];

const CustomePostImageEditor = ({ postsImage, handleSave }: IAvatarEditor,) => {

  const theme = useTheme();

  const [imageRatio, setImageRatio] = useState<number>(1);

  const isXs = useMediaQuery(theme.breakpoints.between("xs", "md"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMdAndLarger = useMediaQuery(theme.breakpoints.up("md"));

  let editorWidth: number = ((isXs && 250) || (isSm && 450) || (isMdAndLarger && 650));
  let editorHeight = editorWidth / imageRatio;

  const [scaledImage, setScaledImage] = useState(1);
  const {t} = useTranslation()

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
        width={editorWidth}
        height={editorHeight}
        border={50}
        scale={scaledImage}
      />
      <Stack spacing={3} direction="row" sx={{ mb: 1 }} alignItems="center">
        <div style={{display:'flex',alignItems:'center'}}>
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
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: "absolute", bottom: 16, right: 16 }}
          icon={<AspectRatioIcon />}
        >
          {ratios.map((ratio) => (
            <SpeedDialAction
              key={ratio.label}
              icon={ratio.label}
              onClick={() => setImageRatio(ratio.value)}
            />
          ))}
        </SpeedDial>
      </Stack>
      <Button
        startIcon={<CheckIcon />}
        size="small"
        variant="contained"
        color="success"
        onClick={() => handleSave(editorRef)}
      >
        {t("signin.confirmButton")}
      </Button>
    </div>
  );
}
;

export {CustomePostImageEditor}