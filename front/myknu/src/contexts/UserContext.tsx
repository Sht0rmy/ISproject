import React, {createContext, ReactNode, useContext, useState} from 'react';
import noop from "../utils/noop";

interface UserContextProps {
    userRole: string;
    setUserRole: React.Dispatch<React.SetStateAction<any>>;
}

const UserContext = createContext<UserContextProps>({
    userRole: '',
    setUserRole: noop
});

export const UserProvider: React.FC<{
    children: ReactNode;
}> = ({ children }) => {
    const [userRole, setUserRole] = useState(() => {
        const storedRole = localStorage.getItem('role');
        return storedRole || '';
    });

    return (
        <UserContext.Provider value={{ userRole, setUserRole }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
