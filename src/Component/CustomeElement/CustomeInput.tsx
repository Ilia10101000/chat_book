import React from "react";
import InputMask from "react-input-mask";
import { TextField } from "@mui/material";

const CustomeInput = ({
  value,
  onChange,
  onBlur,
  mask,
  ...anotherProps
}: any) => {
  if (mask) {
    return (
      <InputMask
        mask={mask}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        maskChar={""}
        alwaysShowMask={false}
        {...anotherProps}
      >
        {(prop: any) => <TextField sx={{ width: "250px" }} {...anotherProps} />}
      </InputMask>
    );
  }
  return (
    <TextField
      sx={{ width: "250px" }}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      {...anotherProps}
    />
  );
};

export { CustomeInput };
