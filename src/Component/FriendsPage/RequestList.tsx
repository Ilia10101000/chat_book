import React from 'react';
import { RequestCardItem } from './RequestCardItem';

function RequestList({ requestList, onClose }) {
    if (!requestList.length) {
        return null
    }
    let res = requestList.map((user, index) => (
      <RequestCardItem key={index} onClose={onClose} {...user} />
    ));
  return (
    <div>{res}</div>
  )
}

export {RequestList}