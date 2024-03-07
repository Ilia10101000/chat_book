import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useFindUsers } from "../useFindUsers";
import { Friend } from "./Friend";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { List, TextField, Box } from "@mui/material";
import { db } from "../../../firebase/auth";
import {
  USERS_D,
  FRIENDS_LIST,
} from "../../../firebase_storage_path_constants/firebase_storage_path_constants";
import { useNavigate } from "react-router-dom";

interface IUser {
  searchQuery: string;
  displayName: string;
  email: string;
  photoURL: string;
  id: string;
}

const FriendsList = ({ authUser, onClose }) => {

  const [usersSearchValue, setUsersSearchValue] = useState("");
  
  const [textValue] = useDebounce(usersSearchValue, 600);

  let resultUserSearch = useFindUsers({
    text: textValue.toLowerCase(),
    authUserId: authUser.id,
    handleClick: handleClickFriendCard,
  });

  const [friendsList, loadingFL, errorFL] = useCollectionData(
    collection(db, `${USERS_D}/${authUser.id}/${FRIENDS_LIST}`)
  );
  let resultFriendsList: React.ReactNode | null;

    const navigate = useNavigate();

    function handleClickFriendCard (id: string){
      navigate(`u/${id}`);
      onClose();
    };

  if (!friendsList?.length) {
    resultFriendsList = <div>Find your friends</div>;
  } else {
    resultFriendsList = (
      <List>
        {friendsList.map((user: IUser) => (
          <Friend
            key={user.id}
            id={user.id}
            displayName={user.displayName}
            photoURL={user.photoURL}
            handleClick={handleClickFriendCard}
          />
        ))}
      </List>
    );
  }

  const handleChangeUsersSearchValue = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUsersSearchValue(e.target.value);
  };
  return (
    <div>
      <Box sx={{ my: 3, textAlign: "center", whiteSpace: "collapse" }}>
        <TextField
          type="text"
          value={usersSearchValue}
          label={"Find friends"}
          onChange={handleChangeUsersSearchValue}
          autoFocus
          autoComplete="off"
        />
      </Box>
      {usersSearchValue ? resultUserSearch : resultFriendsList}
    </div>
  );
};

export { FriendsList };
