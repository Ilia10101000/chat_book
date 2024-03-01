import React, { forwardRef, useRef, useState } from "react";
import AvatarEdit from "react-avatar-editor";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import RedoIcon from "@mui/icons-material/Redo";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CheckIcon from "@mui/icons-material/Check";

interface IAvatarEditor {
  postsImage: File;
  handleSave: (editorRef: React.MutableRefObject<any>) => void;
}

export const CustomeAvatarEditor = 

  ({ postsImage, handleSave }: IAvatarEditor,) => {
    const [rotateDeg, setRotateDeg] = useState(0);
    const [scaledImage, setScaledImage] = useState(1);

    const editorRef = useRef(null);

    const handleChangeRotate = (e: Event, newValue: number) => {
      setRotateDeg(newValue);
    };
    const handleChangeScale = (e: Event, newValue: number) => {
      setScaledImage(newValue);
    };

    return (
      <div style={{display:'flex',flexDirection:'column', alignItems:'center'}}>
        <AvatarEdit
          ref={editorRef}
          image={postsImage}
          width={250}
          height={250}
          rotate={rotateDeg}
          border={100}
          scale={scaledImage}
        />
        <Stack spacing={2} direction="row" sx={{ mb: 1, display:'flex', justifyContent:'center' }} alignItems="center">
          <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <RedoIcon />
            <Slider
              size="small"
              value={rotateDeg}
              max={360}
              onChange={handleChangeRotate}
              valueLabelDisplay="auto"
              sx={{ width: "100px" }}
            />
          </Stack>
          <Stack spacing={0} direction="row" sx={{ mb: 1 }} alignItems="center">
            <ZoomInIcon fontSize="small" />
            <Slider
              size="small"
              value={scaledImage}
              min={0.5}
              max={2}
              step={0.01}
              onChange={handleChangeScale}
              valueLabelDisplay="auto"
              sx={{ width: "100px" }}
            />
          </Stack>
        </Stack>
        <Button startIcon={<CheckIcon/>} size='small' variant="contained" color="success" onClick={() => handleSave(editorRef)}>
          Submit
        </Button>
      </div>
    );
  }
;
