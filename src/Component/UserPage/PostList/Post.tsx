import { ImageListItem } from '@mui/material'
import React from 'react'

function Post({id,text,imageURL}) {
  return (
    <ImageListItem>
      <img src={imageURL} loading="lazy" alt={id} />
    </ImageListItem>
  );
}

export {Post}