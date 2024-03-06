import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { DocumentData, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/auth";
import {
  MARKED_PERSONS,
  POSTS,
  USERS_D,
} from "../../../firebase_storage_path_constants/firebase_storage_path_constants";
import { IconButton, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";

interface IPersonalsMarkedTags {
  userId: string;
  postId: string;
  handleClick: () => void;
  isShownTags: boolean;
  isOwner: boolean;
  removeTag:(id:string) => void
}

function PersonalsMarkedTags({
  userId,
  postId,
  handleClick,
  isShownTags,
  isOwner,
  removeTag
}: IPersonalsMarkedTags) {
  const [markedPesons, loadingMP, errorMP] = useCollectionData(
    collection(db, `${USERS_D}/${userId}/${POSTS}/${postId}/${MARKED_PERSONS}`)
  );

  const getUserName = async (
    userId: string,
    callback: (name: string) => void
  ) => {
    const queryRef = doc(db, USERS_D, userId);
    const response = await getDoc(queryRef);
    const result = response.data().displayName;
    callback(result);
  };
  if (loadingMP || errorMP) {
    return null;
  }
  return (
    <>
      <Tooltip title="Tag a person">
        <IconButton
          sx={{
            position: "absolute",
            bottom: "15px",
            left: "10px",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
          onClick={handleClick}
        >
          <PersonIcon sx={isShownTags ? { color: "red" } : null} />
        </IconButton>
      </Tooltip>
      {isShownTags && (
        <>
          {markedPesons.map((mark) => (
            <TooltipTag
              key={mark.x + mark.y}
              isOwner={isOwner}
              markDoc={mark}
              fetchData={getUserName}
              handleDelete={removeTag}
            />
          ))}
        </>
      )}
    </>
  );
}

export { PersonalsMarkedTags };

function TooltipTag({
  fetchData,
  markDoc,
  isOwner,
  handleDelete,
}: {
  markDoc: DocumentData;
  handleDelete;
  fetchData: (id: string, callback: Dispatch<SetStateAction<string>>) => void;
  isOwner: boolean;
}) {
  const [userName, setUserame] = useState(markDoc.name || "");

  useEffect(() => {
    if (markDoc.type === "link") {
      fetchData(markDoc.userId, setUserame);
    }
  }, [markDoc.type]);

  const mark = (
    <div
      style={{
        position: "absolute",
        top: `${+markDoc.y * 100}%`,
        left: `${+markDoc.x * 100}%`,
        width: "0px",
        height: "0px",
        border: "none",
      }}
    ></div>
  );
  return (
    <Tooltip
      arrow
      open={true}
      title={
        <span
          style={{
            position: "relative",
            display: "inline-block",
          }}
        >
          {isOwner && (
            <IconButton
              onClick={() => handleDelete(markDoc.id)}
              sx={{ position: "absolute", top: "-18px", left: "-30px" }}
            >
              <ClearIcon sx={{ fontSize: "16px" }} />
            </IconButton>
          )}

          {markDoc.type === "link" ? (
            <Link
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
              to={`/user/${markDoc.userId}`}
            >
              <span
                style={{
                  maxWidth: "100px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                  textOverflow: "ellipsis",
                  color: "#a3b7dd",
                }}
              >
                {userName}
              </span>
            </Link>
          ) : (
            <span
              style={{
                display: "inline-block",
                maxWidth: "100px",
                overflowX: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {userName}
            </span>
          )}
        </span>
      }
    >
      {mark}
    </Tooltip>
  );
}
