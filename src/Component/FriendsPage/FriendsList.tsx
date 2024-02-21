import { useState } from "react";
import { useDebounce } from "use-debounce";
import { DocumentData } from "firebase/firestore";
import { useFindFriends } from "./useFindFriends";
import { Friend } from "./Friend";
import { TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface IUser {
  displayName: string;
  email: string;
  photoURL: string;
  id: string;
}

const FriendsList = ({friendsList}) => {
  // const authUser = useAuth()
  // const [value, setValue] = useState("");
  // const [text] = useDebounce(value, 600);

  // let list = useFindFriends( text );
  let result: React.ReactNode | null;

  if (!friendsList.length) {
    result = <div>Find your friends</div>;
  } else {
    result = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {friendsList
          // .filter((user) => user.id !== authUser.uid)
          .map((user: IUser) => (
            <Friend
              key={user.id}
              id={user.id}
              displayName={user.displayName}
              photoURL={user.photoURL}
            />
          ))}
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "10px",
      }}
    >
      {/* <TextField
        sx={{ mb: 3 }}
        type="text"
        value={value}
        label={"Find friends"}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
        autoComplete="off"
      /> */}
      {result}
    </div>
  );
};

export { FriendsList };
