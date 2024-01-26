import { useState } from "react";
import { useDebounce } from "use-debounce";
import { DocumentData } from "firebase/firestore";
import { useFindFriends } from "./useFindFriends";

const FriendsList = () => {

    const [value, setValue] = useState('');
    const [text] = useDebounce(value, 600);

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