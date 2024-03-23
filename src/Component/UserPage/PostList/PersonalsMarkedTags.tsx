import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/auth";
import {
  USERS_D,
} from "../../../firebase_storage_path_constants/firebase_storage_path_constants";
import { IconButton, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import { useTranslation } from "react-i18next";

interface IPersonalsMarkedTags {
  userId: string;
  postId: string;
  markedPersons:DocumentData[];
  handleClick: () => void;
  isShownTags: boolean;
  isOwner: boolean;
  removeTag: (tagData: any) => void;
}

const getUserName = async (
  userId: string,
  callback: (name: string) => void
) => {
  const queryRef = doc(db, USERS_D, userId);
  const response = await getDoc(queryRef);
  const result = response.data().displayName;
  callback(result);
};

function PersonalsMarkedTags({
  handleClick,
  isShownTags,
  markedPersons,
  isOwner,
  removeTag
}: IPersonalsMarkedTags) {

  const {t} = useTranslation()

  return (
    <>
      <Tooltip title={t("userPage.setTag")}>
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
          {markedPersons?.map((mark) => (
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
  const [userName, setUserame] = useState("");

  useEffect(() => {
    if (markDoc.personId) {
      fetchData(markDoc.personId, setUserame);
      
    }
  }, [markDoc.personId]);

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
              onClick={() => handleDelete(markDoc)}
              sx={{ position: "absolute", top: "-18px", left: "-30px" }}
            >
              <ClearIcon sx={{ fontSize: "16px" }} />
            </IconButton>
          )}
            <Link
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
              to={`/u/${markDoc.personId}`}
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
        </span>
      }
    >
      {mark}
    </Tooltip>
  );
}
