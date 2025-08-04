import { createContext } from "react";

const UserContext = createContext({
    isUser: false,
    setIsUser: () => {}
})

export default UserContext