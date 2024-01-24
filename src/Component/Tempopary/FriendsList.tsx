import { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { db } from "../../firebase/auth";
import { DocumentData, collection, query, where } from "firebase/firestore";
import { useFindFriends } from "./useFindFriends";

const FriendsList = () => {

    const [value, setValue] = useState<string>('');
    const [text] = useDebounce(value, 500);

    // const [list, loading, error] = useCollectionData(
    //     query(collection(db,'users'), where('displayName', '>=', text))
    // )

    let list = useFindFriends({ text })
    let result: DocumentData[] | React.ReactNode | null;

    if(!list) {
         result = <div>You dont have a friends</div>
    } else {
        result = <ul>
            {list.map((friend:any) => <li>{friend.displayName}</li>)}
        </ul>
    }
    console.log(list)

    return (
        <div>
        {result}
        <input type="text" value={value} onChange={e => setValue(e.target.value)} autoFocus/>
        </div>
    )
}

export {FriendsList}