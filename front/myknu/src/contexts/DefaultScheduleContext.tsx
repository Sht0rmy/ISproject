import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import noop from "../utils/noop";
import fetcher from "../utils/fetcher/fetcher";

interface DefaultScheduleContextProps {
    groupList: any[];
    setGroupList: React.Dispatch<React.SetStateAction<any[]>>;
    selectedGroup: any;
    setSelectedGroup: React.Dispatch<React.SetStateAction<any>>;
    teacherList: any[];
    setTeacherList: React.Dispatch<React.SetStateAction<any[]>>
    selectedTeacher: any;
    setSelectedTeacher: React.Dispatch<React.SetStateAction<any>>;
}

const DefaultScheduleContext = createContext<DefaultScheduleContextProps>({
    groupList: [],
    setGroupList: noop,
    selectedGroup: '',
    setSelectedGroup: noop,
    teacherList: [],
    setTeacherList: noop,
    selectedTeacher: '',
    setSelectedTeacher: noop,
});

export const DefaultScheduleContextProvider: React.FC<{
    children: ReactNode;
}> = ({children}) => {
    const [groupList, setGroupList] = useState<any[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<any>('');
    const [teacherList, setTeacherList] = useState<any[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState<any>('');

    return (
        <DefaultScheduleContext.Provider
            value={{
                groupList,
                setGroupList,
                selectedGroup,
                setSelectedGroup,
                teacherList,
                setTeacherList,
                selectedTeacher,
                setSelectedTeacher
            }}>
            {children}
        </DefaultScheduleContext.Provider>
    );
};

export const useDefaultScheduleContext = () => {
    const context = useContext(DefaultScheduleContext);

    return context;
};