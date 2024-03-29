import React, { ReactNode } from "react";
import { styled } from "@mui/material";

interface IDrawerAppHeader {
  children?: ReactNode
}

export default function DrawerAppHeader({ children }: IDrawerAppHeader) {
  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
  }));
  if (children) {
    return (
      <DrawerHeader>
        {children}
      </DrawerHeader>
    )
  }
  return <DrawerHeader />;
}

export { DrawerAppHeader };
