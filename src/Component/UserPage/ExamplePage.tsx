import { Button, Modal } from '@mui/material';
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function ExamplePage() {
    const params = useParams();
    const navigate = useNavigate();
    
  return (
      <Modal open={true}>
          <>
          <Button onClick={() => navigate(-1)}>Close</Button>
          <div>{JSON.stringify(params)}</div>
          </>
    </Modal>
  )
}

export {ExamplePage}