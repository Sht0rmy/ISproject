import React, {useEffect, useState} from 'react';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import fetcher from "../../../utils/fetcher/fetcher";
import List from "../list/List";
import classes from '../list/List.module.css'
import {useUser} from "../../../contexts/UserContext";
import {UserRoleType} from "../../../types/user-type";
import Modal from "../modal/Modal";
import modalClasses from "../student-list/studentList.module.css";

const headerName = `Список Викладачів`
const labelHeader = ['id', 'прізвище імя', 'Електронна пошта', 'Група', 'Дата народження']

type Student = {
    email: string,
    id: number,
    name: string,
    type: string
}
const inputPlacelolder = 'Фільтрація по списку'

const StudentList = () => {
    const [inputName, setInputName] = useState<string>('')

    const [teachers, setTeachers] = useState<Student[]>([])
    const [isModal, setIsModal] = useState<boolean>(false)
    const [modalStatus, setModalStatus] = useState<'create' | 'update'>('create')
    const [teacherOnEdit, setTeacherOnEdit] = useState<any>()

    useEffect(() => {
        fetcher<Student[]>(`user/list/PROFESSOR?q=${inputName}`).then(data => {
            setTeachers(data)
        })
    }, [inputName])

    const onDeleteHandler = (id: number) => {

        fetcher(`user/delete/${id}`, {method: 'DELETE'})
            .then(() => {
                const newTeachers = teachers.filter(teacher => teacher.id !== id)
                setTeachers(newTeachers)
            }).catch(e => {
            console.log(e)
        })
    }

    const {userRole} = useUser();

    return (
        <div>
            {isModal && <TeacherModal
                id={teacherOnEdit?.id}
                teacher={teacherOnEdit}
                setIsModal={setIsModal}
                status={modalStatus}
                setTeachers={setTeachers}
            />}
            <List
                inputPlacelolder={inputPlacelolder}
                setInputName={setInputName}
                inputName={inputName}
                labelHeader={labelHeader}
                headerName={headerName}
                setModalStatus={setModalStatus}
                setIsModal={setIsModal}
            >
                <div>

                    {teachers.map(teacher => {
                        return <div className={classes.item}>
                            {teacher.id}
                            | {teacher.name}
                            | {teacher.email}
                            | {teacher.type}
                            <span className={classes.icons}>
                       {userRole === UserRoleType.Admin && <>
                           <EditIcon style={{color: 'black'}}
                                     onClick={() => {
                                         setModalStatus('update')
                                         setTeacherOnEdit(teacher);
                                         setIsModal(true)
                                     }}/>
                           <DeleteIcon style={{color: 'black'}} onClick={e => onDeleteHandler(teacher.id)}/>
                       </>}
                    </span>

                        </div>
                    })}

                </div>
            </List>
        </div>
    );
};

type TeacherModalProps = {
    status: 'create' | 'update'
    id?: string | number,
    setIsModal: any,
    setTeachers: any
    teacher?: any

}
const TeacherModal: React.FC<TeacherModalProps> = ({setIsModal, teacher, status, id, setTeachers}) => {
    const [name, setName] = useState<any>(() => !!teacher ? teacher.name : '')
    const [password, setPassword] = useState<any>('')
    const [gmail, setGmail] = useState<any>(() => !!teacher ? teacher.email : '')
    const actionName = status === 'create' ? 'Створити викладача' : 'Редагувати викладача'
    const onCreateHandler = () => {
        const body = {
            name: name,
            email: gmail,
            password: password,
            type: 'PROFESSOR',
        }
        fetcher('user/create', {
            method: 'POST',
            body: JSON.stringify(body)
        })
            .then(data => {
                setIsModal(false)
                setTeachers(teachers => [...teachers, data])
            })
            .catch(eeeee => {
                console.log(eeeee)
            })
    }

    const onUpdateHandler = () => {

        const body = {
            name: name,
            email: gmail,
            type: 'PROFESSOR',
        }
        fetcher<any>(`user/update/${teacher.id}`, {
            method: 'PUT',
            body: JSON.stringify(body)
        })
            .then((data: any) => {
                setTeachers(teachers => {
                    const newTeachers = teachers.map(teacher => teacher.id !== data.id ? teacher : data)
                    return newTeachers
                })
                setIsModal(false)
            })
            .catch(eeeee => {
                console.log(eeeee)
            })

    }

    return (<Modal
        actionName={actionName}
        setIsModal={setIsModal}
        onAction={status === 'create' ? onCreateHandler : onUpdateHandler}
    >
        <div className={modalClasses.wrapper}>
            <div className={modalClasses.leftSide}>
                <span>Прізвище ім'я</span>
            </div>
            <div className={modalClasses.writeSide}>
                <input className={modalClasses.inputStyle}
                       type="text"
                       onChange={e => setName(e.target.value)}
                       value={name} placeholder={'Прізвище ім\'я'}/>
            </div>
        </div>
        {!teacher && <div className={modalClasses.wrapper}>
            <div className={modalClasses.leftSide}><span>Пароль</span></div>
            <div className={modalClasses.writeSide}>
                <input type="text"
                       className={modalClasses.inputStyle}
                       onChange={e => setPassword(e.target.value)}
                       value={password}
                       placeholder={'Пароль'}/>
            </div>
        </div>}
        <div className={modalClasses.wrapper}>
            <div className={modalClasses.leftSide}><span>Електронна пошта</span></div>
            <div className={modalClasses.writeSide}>
                <input type="text"
                       className={modalClasses.inputStyle}
                       onChange={e => setGmail(e.target.value)}
                       value={gmail} placeholder={'Електронна пошта'}/>
            </div>
        </div>

    </Modal>)
}

export default StudentList;
