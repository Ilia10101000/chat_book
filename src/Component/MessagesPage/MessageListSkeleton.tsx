import React from "react";
import { Stack, Skeleton } from "@mui/material";

function MessageListSkeleton() {
  const result = new Array(5).fill(1).map((item, index) => (
    <Skeleton
      key={index}
      variant="rounded"
      width={170}
      height={60}
      sx={{
        ...(index % 2 ? { ml: "auto" } : null),
      }}
    />
  ));

  return <Stack gap={3}>{result}</Stack>;
}

export { MessageListSkeleton };
