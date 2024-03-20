import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Box,
  Modal,
  IconButton,
  SxProps,
  Theme,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import CloseIcon from "@mui/icons-material/Close";
import { UserAvatar } from "../../Drawer/DrawerUserAvatar";
import { useDebounce } from "use-debounce";
import { db } from "../../../firebase/auth";
import { USERS_D } from "../../../firebase_storage_path_constants/firebase_storage_path_constants";
import SendIcon from "@mui/icons-material/Send";

const style: SxProps<Theme> = {
  position: "relative",
  top: "30%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "250px",
  backgroundColor: (theme) =>
    theme.palette.mode === "light" ? "#fff" : "#000",
  display: "flex",
  flexDirection: "column",
};

const SearchUsersDialog = ({ open, closeModal, handleSubmit }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [defSearchQuery] = useDebounce(searchQuery, 1000);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchListHeight, setSearchListHeight] = useState(0);

  const listRef = useRef < HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (listRef.current) {
      setSearchListHeight(listRef.current.clientHeight);
    }
  }, [options.length]);

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
      setOptions(result);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (defSearchQuery && !selectedUser) {
      fetchData(defSearchQuery);
    } else if (!defSearchQuery && !!options) {
      setOptions([]);
    }
  }, [defSearchQuery]);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (selectedUser) {
      setSelectedUser(null);
    }
    setSearchQuery(e.target.value);
  };

  const handleSelectUser = (userData: any) => {
    setSelectedUser(userData);
    setSearchQuery(userData.displayName);
    setOptions([]);
  };

  const addUserTag = () => {
    handleSubmit(selectedUser.id);
  };

  return (
    <Modal open={open}>
      <Box sx={style}>
        <IconButton
          onClick={closeModal}
          sx={{ position: "absolute", right: "-30px", top: "-30px" }}
        >
          <CloseIcon sx={{ color: "#fff" }} />
        </IconButton>
        <TextField
          ref={listRef}
          sx={{ width: "100%" }}
          placeholder={"Choose person"}
          value={searchQuery}
          onChange={handleChange}
          InputProps={{
            endAdornment: loading ? (
              <CircularProgress color="error" size={20} />
            ) : selectedUser && searchQuery ? (
              <IconButton onClick={addUserTag}>
                <SendIcon sx={{ fontSize: "20px" }} />
              </IconButton>
            ) : null,
          }}
        />
        {!!options.length && (
          <List
            sx={{
              width: "100%",
              position: "absolute",
              left: 0,
              top: `${searchListHeight}px`,
              backgroundColor: (theme) =>
                theme.palette.mode === "light" ? "#fff" : "#000",
            }}
          >
            {options?.map((option) => (
              <ListItemButton
                key={option.id}
                sx={{ p: 0 }}
                onClick={() => handleSelectUser(option)}
              >
                <ListItem>
                  <ListItemAvatar sx={{ mr: 2 }}>
                    <UserAvatar
                      userName={option.displayName}
                      photoURL={option.photoURL}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primaryTypographyProps={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    primary={option.displayName}
                  />
                </ListItem>
              </ListItemButton>
            ))}
          </List>
        )}
        {!loading &&
          !options.length &&
          defSearchQuery &&
          !selectedUser && (
            <Box
              sx={{
                width: "100%",
                p: 2,
                textAlign: "center",
                position: "absolute",
                left: 0,
                top: `${searchListHeight}px`,
                backgroundColor: (theme) =>
                  theme.palette.mode === "light" ? "#fff" : "#000",
              }}
            >
              No matches
            </Box>
          )}
      </Box>
    </Modal>
  );
};

export { SearchUsersDialog };
