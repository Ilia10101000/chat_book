import { useContext, useState } from "react";
import { useDebounce } from "use-debounce";
import { DocumentData } from "firebase/firestore";
import { useFindFriends } from "./useFindFriends";
import { UserFindItem } from "./UserFindItem";
import { TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";

interface IUser {
  displayName: string;
  email: string;
  emailVerified: string;
  id: string;
}

const FriendsList = () => {
  const authUser = useContext(UserContext)
  const [value, setValue] = useState("");
  const [text] = useDebounce(value, 600);

  let list = useFindFriends( text );
  let result: DocumentData[] | React.ReactNode | null;

  if (!list) {
    result = <div>You dont have a friends</div>;
  } else {
    result = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {list.filter(user => user.id !== authUser.uid).map((user: IUser) => (
            <UserFindItem key={user.id} id={user.id} name={user.displayName} />
        ))}
      </div>
    );
  }
  console.log(list);

  return (
    <div
      style={{
        padding: "50px",
      }}
    >
      <TextField
        sx={{ mb: 3 }}
        type="text"
        value={value}
        label={"Find friends"}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
        autoComplete="off"
      />
      {result}
    </div>
  );
};

export { FriendsList };
