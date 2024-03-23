import React from "react";
import { useTheme } from "../../theme";
import {
  Badge,
  Box,
  Typography,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

function AppTheme({ descLabel }) {
  const { changeAppTheme, appThemesValues, appTheme } = useTheme();

  return (
    <Box>
      <Typography variant="h4" sx={{ textAlign: "center", my: 2 }}>
        {descLabel}
      </Typography>
      <Box sx={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        {Object.keys(appThemesValues).map((theme, index) => {
          const box = (
            <Box
              onClick={() => changeAppTheme(theme)}
              sx={{
                borderRadius: "10px",
                overflow: "hidden",
                cursor: "pointer",
                border: "1px solid #8c8c8c",
              }}
            >
              <div
                style={{
                  height: "25px",
                  width: "50px",
                  ...(appThemesValues[theme].type === "image"
                    ? { backgroundImage: appThemesValues[theme].light }
                    : { backgroundColor: appThemesValues[theme].light }),
                }}
              />
              <div
                style={{
                  height: "25px",
                  width: "50px",
                  ...(appThemesValues[theme].type === "image"
                    ? { backgroundImage: appThemesValues[theme].dark }
                    : { backgroundColor: appThemesValues[theme].dark }),
                }}
              />
            </Box>
          );
          const isSelected = appTheme === theme;
          return isSelected ? (
            <div key={index}>
              <Badge badgeContent={<CheckBoxIcon />}>{box}</Badge>
            </div>
          ) : (
            <div key={index}>{box}</div>
          );
        })}
      </Box>
    </Box>
  );
}

export { AppTheme };
