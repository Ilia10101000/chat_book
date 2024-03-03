import React from 'react';
import {ImageListItem } from '@mui/material';

function Post({ post, handleSelect }) {
  return (
    <ImageListItem sx={{
      '&:hover': {
      cursor:'pointer'
    }}} onClick={() => handleSelect(post)}>
      
        <img
          style={{ objectFit: "contain" }}
          src={post.imageURL}
          loading="lazy"
          alt={post.id}
        />
      </ImageListItem>
  );
}

export { Post }
