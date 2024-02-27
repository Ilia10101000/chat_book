import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../firebase/auth";
import { ListItem, IconButton, ListItemAvatar, ListItemText, Avatar, CircularProgress, List, ListItemButton } from "@mui/material";
import { collection, query, where, limit } from "firebase/firestore";
import { USERS_D } from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import User from '../../img/default-user.svg'


interface IUserCard {
  handleClick: (id:string) => void;
  id: string,
  displayName: string,
  photoURL:string
}

interface IUseFindUsers {
  handleClick: (id:string) => void;
  text: string;
  authUserId: string;
}

function UserCard({ handleClick, ...user }:IUserCard) {

  return (
    <ListItemButton
      onClick={() => handleClick(user.id)}
      sx={{ p: 0}}
    >
      <ListItem>
        <ListItemAvatar sx={{ mr: 2 }}>
          <Avatar
            alt={user.displayName}
            src={user.photoURL || User}
            sx={{ width: 56, height: 56 }}
          />
        </ListItemAvatar>
        <ListItemText
          secondaryTypographyProps={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          primaryTypographyProps={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          primary={user.displayName}
        />
      </ListItem>
    </ListItemButton>
  );
}

const useFindUsers = ({text, authUserId, handleClick} :IUseFindUsers ) => {
  const [list, loading, error] = useCollectionData(
    query(
      collection(db, USERS_D),
      where("searchQuery", ">=", text),
      where("searchQuery", "<=", text + "\uf8ff"),
      limit(5)
    )
  );

  let result: React.ReactNode;

  if (error) {
    result = <div>Some error occured</div>;
  }
  else if (loading) {
    result = <CircularProgress/>;
  }
  else if (list.length === 0) {
    result = <div>Not matches</div>;
  } else {
    result = (
      <List>
        {list
          .filter((user) => user.id !== authUserId)
          .map((user) => (
            <UserCard
              key={user.id}
              handleClick={handleClick}
              id={user.id}
              displayName={user.displayName}
              photoURL={user.photoURL}
            />
          ))}
      </List>
    );
  }

  return result;
};

export { useFindUsers };
