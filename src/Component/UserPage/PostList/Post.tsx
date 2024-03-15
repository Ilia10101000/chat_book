import React, { useLayoutEffect, useRef, useState } from "react";
import {  ImageListItem, Skeleton } from "@mui/material";

function Post({ post, handleSelect }) {

  const [isLoadedImage, setIsLoadedImage] = useState(false);
  const [heightSkeleton, setHeightSkeleton] = useState(0);
  const containerRef = useRef<HTMLLIElement>(null);

  useLayoutEffect(() => {
    if (containerRef?.current) {
      setHeightSkeleton(containerRef.current.clientWidth)
    }
  },[])

  return (
    <ImageListItem
      ref={containerRef}
      sx={{
        backgroundColor: "#000",
        p: "2px",
        "&:hover": {
          cursor: "pointer",
        },
      }}
      onClick={() => handleSelect(post.ownerPostId, post.id)}
    >
      <img
        style={{
          objectFit: "contain",
          display: isLoadedImage ? "block" : "none",
        }}
        src={post.imageURL}
        onLoad={() => setIsLoadedImage(true)}
        alt={post.id}
      />

      <Skeleton
        sx={{
          width: `${heightSkeleton - 5}px`,
          height: `${heightSkeleton -5}px`,
          display: isLoadedImage ? "none" : "block",
        }}
        variant="rounded"
      />
    </ImageListItem>
  );
}

export { Post };
