import { useState } from 'react';
import UserContext from './userContext';

const UserProvider = ({ children }) => {
    const [isUser, setIsUser] = useState(false);
    
    return (
        <UserContext.Provider value={{ isUser, setIsUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;