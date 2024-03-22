import React from "react";
import { ListItem, ListItemAvatar, ListItemText,ListItemButton } from "@mui/material";
import { UserAvatar } from "../Drawer/DrawerUserAvatar";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "../../firebase/auth";
import { USERS_D } from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { UserFriendsSkeleton } from "../CustomeElement/UserItemListSkeleton";


interface IUserCard {
  handleClick: (id: string) => void;
  userId: string;
}

function UserCard({ handleClick, userId}: IUserCard) {
  
  const [userData, loadingUD, errorUD] = useDocumentData(doc(db, (`${USERS_D}/${userId}`)))
  
  if (loadingUD) {
    return <UserFriendsSkeleton/>
  } else if (errorUD) {
    return <div>Failed request</div>
  } else {
    return (
      <ListItemButton onClick={() => handleClick(userData?.id)} sx={{ p: 0 }}>
        <ListItem>
          <ListItemAvatar>
            <UserAvatar
              userName={userData?.displayName}
              photoURL={userData?.photoURL}
            />
          </ListItemAvatar>
          <ListItemText
            primaryTypographyProps={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            primary={userData?.displayName}
          />
        </ListItem>
      </ListItemButton>
    );

  }

}


export { UserCard };
