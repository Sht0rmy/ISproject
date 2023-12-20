import React, {useEffect, useState} from 'react';
import List from "../list/List";
import fetcher from "../../../utils/fetcher/fetcher";
import classes from "../list/List.module.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import modalClasses from './studentList.module.css'
import Modal from "../modal/Modal";
import {useUser} from "../../../contexts/UserContext";
import {UserRoleType} from "../../../types/user-type";


const headerName = `Список студентів`
const labelHeader = ['id', 'прізвище імя', 'Електронна пошта', 'Група', 'дата народження']
const inputPlacelolder = 'Фільтрація по списку'

type Student = {
    email: string,
    id: number,
    name: string,
    type: string
    group: any
}

const StudentList = () => {
    const [inputName, setInputName] = useState<string>('')
    const [students, setStudents] = useState<Student[]>([])
    const [isModal, setIsModal] = useState<boolean>(false)
    const [modalStatus, setModalStatus] = useState<'create' | 'update'>('create')
    const [studentOnEdit, setStudentOnEdit] = useState<any>()

    const {userRole} = useUser();

    const onDeleteHandler = (id: number) => {
        fetcher(`user/delete/${id}`, {method: 'DELETE'})
            .then(data => {
                const newStudents = students.filter(student => student.id !== id)
                setStudents(newStudents)

            }).catch(e => {
            console.log(e)

        })
    }

    useEffect(() => {
        fetcher<Student[]>(`user/list/STUDENT?q=${inputName}`)
            .then(data => {
                setStudents(data)
                console.log(data)
            })
    }, [inputName])

    return (
        <div>
            {isModal && <StudentModal
                student={studentOnEdit}
                setStudents={setStudents}
                setIsModal={setIsModal}
                status={modalStatus}/>}
            <List
                inputPlacelolder={inputPlacelolder}
                setInputName={setInputName}
                inputName={inputName}
                labelHeader={labelHeader}
                headerName={headerName}
                setIsModal={setIsModal}
                setModalStatus={setModalStatus}
            >
                <div>

                    {students.map(student => {
                        return <div className={classes.item}>
                            {student.id} | {student.name}
                            |{student?.group?.name}
                            | {student.email}
                            | {student.type}
                            <span className={classes.icons}>
                               {userRole === UserRoleType.Admin && (<>
                                   <EditIcon style={{color: 'black'}}
                                             onClick={() => {
                                                 setModalStatus('update')
                                                 setStudentOnEdit(student);
                                                 setIsModal(true)
                                             }}/>
                                   <DeleteIcon style={{color: 'black'}} onClick={e => onDeleteHandler(student.id)}/>
                               </>)}

                            </span>
                        </div>
                    })}

                </div>
            </List>
        </div>
    );
};
type CreateModalProps = {
    status: 'create' | 'update'
    id?: string | number,
    setIsModal: any,
    setStudents: any
    student?: any

}
const StudentModal: React.FC<CreateModalProps> = ({status, setIsModal, setStudents, id, student}) => {
    const [name, setName] = useState<any>(() => !!student ? student.name : '')
    const [password, setPassword] = useState<any>('')
    const [gmail, setGmail] = useState<any>(() => !!student ? student.email : '')
    const [group, setGroup] = useState<any>(() => !!student ? student.group : {id: 0, name: ''})
    const [groups, setGroups] = useState<any[]>([])
    const actionName = status === 'create' ? 'Створити студента' : 'Редагувати студента'

    useEffect(() => {
        fetcher<any[]>('group/list')
            .then((data) => {
                console.log(data)
                setGroups(data)

            }).catch(e => {
            console.log(e)

        })
    }, [])

    const onCreateHandler = () => {
        const body = {
            name: name,
            email: gmail,
            password: password,
            type: 'STUDENT',
            groupId: group.id,
        }
        fetcher('user/create', {
            method: 'POST',
            body: JSON.stringify(body)
        })
            .then(data => {
                setIsModal(false)
                setStudents(students => [...students, data])
            })
            .catch(eeeee => {
                console.log(eeeee)
            })
    }
    const onUpdateHandler = () => {

        const body = {
            name: name,
            email: gmail,
            type: 'STUDENT',
            groupId: group.id,
        }
        fetcher<any>(`user/update/${student.id}`, {
            method: 'PUT',
            body: JSON.stringify(body)
        })
            .then((data: any) => {
                setStudents(students => {
                    const newStudents = students.map(student => student.id !== data.id ? student : data)
                    return newStudents
                })
                setIsModal(false)
            })
            .catch(eeeee => {
                console.log(eeeee)
            })

    }
    const onSelecthandler = (e: any) => {
        console.log(e)
        let group = groups.find(i => +i.id === +e.target.value)
        setGroup(group)
    }

    return <Modal actionName={actionName} setIsModal={setIsModal}

                  onAction={status === 'create' ? onCreateHandler : onUpdateHandler}>

        <div className={modalClasses.wrapper}>
            <div className={modalClasses.leftSide}>
                <span>Прізвище ім'я</span>
            </div>
            <div className={modalClasses.writeSide}>
                <input
                    type="text"
                    className={modalClasses.inputStyle}
                    onChange={e => setName(e.target.value)}
                    value={name} placeholder={'Прізвище ім\'я'}/>
            </div>
        </div>
        {!student && <div className={modalClasses.wrapper}>
            <div className={modalClasses.leftSide}><span>Пароль</span></div>
            <div className={modalClasses.writeSide}>
                <input
                    type="text"
                    className={modalClasses.inputStyle}
                    onChange={e => setPassword(e.target.value)}
                    value={password} placeholder={'Пароль'}/>
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
        <div className={modalClasses.wrapper}>
            <div className={modalClasses.leftSide}><span>Група</span></div>
            <div className={modalClasses.writeSide} defaultValue={group?.id}>
                <select className={modalClasses.inputStyle} onChange={e => onSelecthandler(e)}>
                    {groups.map((localGroup: any) => (<option style={{height: '30px'}} value={localGroup.id}>{localGroup.name}</option>))}
                </select>
            </div>
        </div>


    </Modal>
}


export default StudentList;