import React from 'react';
import {
  ListItem,
  ListItemAvatar,
  Skeleton,
} from "@mui/material";

function UserFriendsSkeleton() {
  return (
    <ListItem>
      <ListItemAvatar>
        <Skeleton variant="circular" width={40} height={40} />
      </ListItemAvatar>
      <Skeleton variant="rectangular" width={150} height={20} />
    </ListItem>
  );
}
function UserRequestSkeleton() {
  return (
    <ListItem sx={{ p: 0 }}>
      <ListItemAvatar sx={{ p: 1 }}>
        <Skeleton variant="circular" width={40} height={40} />
      </ListItemAvatar>
      <Skeleton variant="rectangular" width={120} height={20} />
      <Skeleton
        sx={{ ml: "auto", mr: 1 }}
        variant="circular"
        width={25}
        height={25}
      />
    </ListItem>
  );
}

export { UserFriendsSkeleton, UserRequestSkeleton };