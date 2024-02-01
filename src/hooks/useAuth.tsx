import React, {useContext} from "react";
import { UserContext } from "../App";

function useAuth() {
    return useContext(UserContext)
}

export {useAuth}