import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { UserCard } from "../UserCard.tsx";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { List, TextField, Box, CircularProgress } from "@mui/material";
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
  const [textValue] = useDebounce(usersSearchValue, 800);

  const [resultUserSearch, setResultUserSearch] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [friendsList, loadingFL, errorFL] = useCollectionData(
    collection(db, `${USERS_D}/${authUser.id}/${FRIENDS_LIST}`)
  );

  const fetchData = async (searchQuery: string) => {
    setLoading(true);
    try {
      const queryRef = query(
        collection(db, USERS_D),
        where("searchQuery", ">=", searchQuery.toLowerCase()),
        where("searchQuery", "<=", searchQuery.toLowerCase() + "\uf8ff"),
        limit(5)
      );
      const data = await getDocs(queryRef);
      const result = data.docs.map((doc) => doc.data());
      setResultUserSearch(result);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (textValue) {
        fetchData(textValue)
    } else if (!textValue && resultUserSearch) {
      setResultUserSearch(null)
      }
  }, [textValue])
  
  let result: React.ReactNode | null;

    const navigate = useNavigate();

    function handleClickFriendCard (id: string){
      navigate(`u/${id}`);
      onClose();
  };
  
  let noResult = <div style={{textAlign:'center'}}>{resultUserSearch ? 'Not matches' : 'Find your friends'}</div>;
  let dataList = resultUserSearch ? resultUserSearch : friendsList;

  if (!dataList?.length) {
    result = noResult;
  } else {
    result = (
      <List>
        {dataList.map((user: IUser) => (
          <UserCard
            key={user.id}
            userId={user.id}
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
      {loading ? <CircularProgress /> : result}
    </div>
  );
};

export { FriendsList };
