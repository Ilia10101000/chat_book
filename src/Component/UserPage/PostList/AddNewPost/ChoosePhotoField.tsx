import React, { forwardRef } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

interface IChoosePhotoField {
    isActive: boolean;
    handleClick:() => void
}

export const ChoosePhotoField = forwardRef(
  ({ isActive, handleClick }: IChoosePhotoField, ref) => {
    return (
      <>
        <Box
          ref={ref}
          sx={{
            width: "100%",
            minHeight: "150px",
            border: isActive ? "1px solid #8c8c8c" : "1px dashed #8c8c8c",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "inherit",
            filter: isActive ? "brightness(150%)" : null,
          }}
        >
          <Typography>
            {isActive ? <AddPhotoAlternateIcon /> : "Drag your photo here"}
          </Typography>
        </Box>
        <Divider />
        <Typography>or</Typography>
        <Button
          onClick={handleClick}
          startIcon={<AddPhotoAlternateIcon />}
          variant="contained"
        >
          Choose
        </Button>
      </>
    );
  }
);
