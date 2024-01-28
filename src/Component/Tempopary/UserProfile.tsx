import { doc } from "firebase/firestore";
import React from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/auth";

const UserProfile = () => {
    const { id } = useParams();

    const [user, loading, error] = useDocument(doc(db, 'users', id))
    console.log(user)
    
    if (loading) {
        return (
            <div>Loading...</div>
        )
    }
    if (error) {
        return (
            <div>Some error has occured</div>
        )
    }

    const {displayName, email} = user.data()
    return (
        <div >
            <div>{displayName}</div>
            <div>{email}</div>
        </div>
    )
};

export {UserProfile}