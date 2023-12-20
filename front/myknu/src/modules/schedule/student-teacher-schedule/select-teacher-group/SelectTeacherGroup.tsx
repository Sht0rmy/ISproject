import Select from "../../../../components/select/Select";
import {MenuItem, SelectChangeEvent} from '@mui/material';
import {useEffect} from "react";
import {
    SelectBlockWrapper,
    SelectTeacherGroupTitle,
    SelectTeacherGroupWrappper,
    SelectTitleWrapper
} from "./SelectTeacherGroup.styled";
import fetcher from "../../../../utils/fetcher/fetcher";
import {useDefaultScheduleContext} from "../../../../contexts/DefaultScheduleContext";
import {useUser} from "../../../../contexts/UserContext";
import {UserRoleType} from "../../../../types/user-type";

export const SelectTeacherGroup = () => {
    const {userRole} = useUser();
    const isStudent = userRole === UserRoleType.Student;

    const TEACHER_LABEL = 'Оберіть викладача';

    const STUDENT_LABEL = 'Оберіть групу'

    const {
        groupList,
        setGroupList,
        selectedGroup,
        setSelectedGroup,
        selectedTeacher,
        setSelectedTeacher,
        teacherList,
        setTeacherList
    } = useDefaultScheduleContext();

    const handleChangeTeacher = (event: SelectChangeEvent) => {
        setSelectedTeacher(event.target.value as string);
    };

    const handleChangeGroup = (event: SelectChangeEvent) => {
        setSelectedGroup(event.target.value as string);
    };

    useEffect(() => {
        if (isStudent) {
            fetcher<any[]>(`group/list`)
                .then((data: any) => {
                    setGroupList(data)
                }).catch(e => {
                console.log(e)
            })
        } else {
            fetcher<any[]>(`user/list/PROFESSOR`)
                .then((data: any) => {
                    setTeacherList(data)
                }).catch(e => {
                console.log(e)
            })
        }
    }, []);

    return (
        <SelectBlockWrapper>
            <SelectTitleWrapper>
                <SelectTeacherGroupTitle>{isStudent ? STUDENT_LABEL : TEACHER_LABEL}</SelectTeacherGroupTitle>
            </SelectTitleWrapper>
            <SelectTeacherGroupWrappper>
                <Select
                    id={`id-${isStudent ? STUDENT_LABEL : TEACHER_LABEL}`}
                    label={isStudent ? STUDENT_LABEL : TEACHER_LABEL}
                    value={isStudent ? selectedGroup : selectedTeacher}
                    onChange={isStudent ? handleChangeGroup : handleChangeTeacher}
                >
                    {isStudent
                        ? groupList.map((groupItem: any) => (
                            <MenuItem key={groupItem.name} value={groupItem.id}>
                                {groupItem.name}
                            </MenuItem>
                        ))
                        : teacherList.map((teacherItem) => (
                            <MenuItem key={teacherItem.name} value={teacherItem.id}>
                                {teacherItem.name}
                            </MenuItem>
                        ))}
                </Select>
            </SelectTeacherGroupWrappper>
        </SelectBlockWrapper>
    );
};
