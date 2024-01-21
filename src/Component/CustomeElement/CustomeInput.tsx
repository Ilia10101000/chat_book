import React from "react";
import InputMask from "react-input-mask";
import { TextField, Box } from "@mui/material";

// const CustomeInput = (props: any) => {
const CustomeInput = ({
  value,
  onChange,
  onBlur,
  mask,
  ...anotherProps
}: any) => {
  // if (props.mask) {
  if (mask) {
    return (
      <InputMask
        // {...props} maskChar={""} alwaysShowMask={false}>
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
      // {...props}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      {...anotherProps}
    />
  );
};

export { CustomeInput };
