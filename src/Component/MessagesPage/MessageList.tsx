"use client";

import { Paper, Box } from "@mui/material";
import { collection, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Skeleton from "@mui/material/Skeleton";

interface Message {
  name: string;
}

export function MessageList() {

  const [message, loading, error] = useCollection(
    query(
      collection(db, "message"),
      orderBy("time", "asc")
    )
  );

  const skeleton = new Array(10)
    .fill("0")
    .map((_, index) => (
      <Skeleton
        variant="rectangular"
        width={100}
        height={70}
        sx={
          {
            borderRadius: '5px',
            ...(
              !(index % 2) && { ml: "auto" } 
          )
        }
          
        }
      />
    ));

  return (
    <Box
      sx={{
        minWidth: "300px",
        maxWidth: "600px",
        marginX: "auto",
        gap: "10px",
        height:'calc(100vh - 100px)',
        p: 5,
        display: "flex",
        flexDirection: "column",
        background: "rgba(0,0,0,0.5)",
      }}
    >
      {loading && skeleton}
      {message?.docs.map((doc, index) => {

        const { text, time } = doc.data();

        const createdAt = `${time.toDate().getHours()}:${time
          .toDate()
          .getMinutes()}`;
        
        return (
          <Paper
            key={index}
            elevation={20}
            sx={{
              p: 2,
              alignSelf: index % 2 ? "flex-start" : "flex-end",
              maxWidth: "200px",
              overflowWrap: "break-word",
              position:'relative'
            }}
          >
            {text}
            <div style={{position:'absolute', bottom:'0px', right:'5px',fontSize:'11px', color:'grey', userSelect:'none'}}>{createdAt}</div>
          </Paper>
        )})}
      <Box sx={{ height: "50px" }}></Box>
    </Box>
  );
}
