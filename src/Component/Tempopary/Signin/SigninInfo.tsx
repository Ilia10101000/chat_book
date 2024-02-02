import { TextField } from "@mui/material";
import React from "react"
import { useOutletContext, useParams } from "react-router-dom"

function SigninInfo() {
    const { info } = useParams();
    const signinForm = useOutletContext();
    
    if (info === 'displayName') {
        return (
            <TextField value={signinForm.}/>
        )
    }

    return (
        <div>{info}</div>
    )
};

export {SigninInfo}