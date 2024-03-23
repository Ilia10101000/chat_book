import React, { forwardRef } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useTranslation } from 'react-i18next';

interface IChoosePhotoField {
    isActive: boolean;
    handleClick:() => void
}

export const ChoosePhotoField = forwardRef(
  ({ isActive, handleClick }: IChoosePhotoField, ref) => {
    const {t} = useTranslation()
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
            {isActive ? <AddPhotoAlternateIcon /> : t("imageModal.dnd")}
          </Typography>
        </Box>
        <Divider />
        <Typography>{t("imageModal.or")}</Typography>
        <Button
          onClick={handleClick}
          startIcon={<AddPhotoAlternateIcon />}
          variant="contained"
        >
          {t("imageModal.chooseImage")}
        </Button>
      </>
    );
  }
);



/*
ЇїІіЄєҐґ

*/