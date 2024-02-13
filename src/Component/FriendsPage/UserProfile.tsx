import React from "react";
import { doc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { Link, useParams } from "react-router-dom";
import { db } from "../../firebase/auth";
import { Button } from "@mui/material";
import User from "../../img/default-user.svg";

const UserProfile = () => {
  const { id } = useParams();

  const [user, loading, error] = useDocument(doc(db, "users", id));

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Some error has occured</div>;
  }

  const { displayName, email,photoURL } = user.data();
  return (
    <div>
      <div style={{ display: "flex" }}>
        <img
          style={{ display: "flex", margin: " 0px 40px" }}
          src={photoURL || User}
        />
        <div>
          <div>{displayName}</div>
          <div>{email}</div>
        </div>
      </div>
      <Link to={`/messages/${id}`}>
        <Button>Start chat</Button>
      </Link>
    </div>
  );
};

export { UserProfile };
