import React, { useState } from "react";

import UkraineFlag from "../../img/Flag_of_Ukraine.svg";
import UKFlag from "../../img/united-kingdom-flag-icon.svg";
import { useTranslation } from "react-i18next";
import { MenuItem, Select, SelectChangeEvent, SxProps } from "@mui/material";

function SwitchLanguage({ sx }: { sx?: SxProps }) {
  const { t, i18n } = useTranslation();

  const toogleLanguage = (e: SelectChangeEvent<"ua" | "eng">) => {
    e.preventDefault();
    i18n.changeLanguage(e.target.value);
    localStorage.setItem("lang", e.target.value);
  };

  return (
    <Select
      sx={{
        "& .MuiSelect-icon": {
          display: "none",
        },
        "&:hover .MuiSelect-icon": {
          display: "none",
        },
        "&:focus .MuiSelect-icon": {
          display: "none",
        },
        "& .MuiSelect-select.MuiInputBase-input": {
            paddingRight: "0px",
        },
        "& .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input": {
            padding: "9px 9px 3px 9px",
        },
        ...sx,
      }}
      onChange={toogleLanguage}
      value={i18n.language === "ua" ? "ua" : "eng"}
    >
      <MenuItem value={"ua"}>
        <div style={{ width: "25px" }}>
          <img
            style={{ width: "100%", borderRadius: "2px" }}
            src={UkraineFlag}
            alt="ua"
          />
        </div>
      </MenuItem>
      <MenuItem value={"eng"}>
        <div style={{ width: "25px" }}>
          <img
            style={{ width: "100%", borderRadius: "2px" }}
            src={UKFlag}
            alt="uk"
          />
        </div>
      </MenuItem>
    </Select>
  );
}

export { SwitchLanguage };