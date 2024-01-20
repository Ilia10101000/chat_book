import React, { FormEvent, useContext } from "react";
import { collection, orderBy, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../firebase/auth";
import { UserContext } from "../../App";
import {addDoc, serverTimestamp} from 'firebase/firestore'
import { AuthStateHook } from "react-firebase-hooks/auth";

export default function () {
  const [value, setValue] = React.useState("");
  const [messages, loading, error] = useCollectionData(
    query(collection(db, "messages"), orderBy('time','asc'))
  );
    
    const [user] : AuthStateHook = useContext(UserContext);

  const handleSubmit = async (event: FormEvent) => {
      event.preventDefault();
      const senderDoc = {
        from: user?.uid,
        to:'111',
        text: value,
        time: serverTimestamp(),
      };
    await addDoc(collection(db, 'messages'), senderDoc);
    setValue('')
  };

  let status;
  if (loading) {
    status = <div>Loading...</div>;
  }
  if (error) {
    status = <div>Some error occured!</div>;
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "calc(100vh - 20px)",
        padding: "10px",
      }}
    >
      <div
        style={{
          width: "80%",
          display: "flex",
          flexDirection: "column",

          border: "1px solid grey",
          borderRadius: "10px",
          flexGrow: 3,
        }}
      >
        {messages
          ? messages.map((mes, index) => (
              <div
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  border: "1px solid grey",
                  alignSelf: index % 2 ? "start" : "end",
                }}
              >
                {mes.text}
              </div>
            ))
          : status}
      </div>
      <form style={{ display: "flex", width: "80%" }} onSubmit={handleSubmit}>
        <textarea
          style={{ flexGrow: 1 }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
