import React from 'react';
import {ImageListItem } from '@mui/material';

function Post({ post, handleSelect }) {
  return (
    <ImageListItem sx={{
      backgroundColor: '#000',
      p:'2px',
      '&:hover': {
      cursor:'pointer'
    }}} onClick={() => handleSelect(post.id)}>
      
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
