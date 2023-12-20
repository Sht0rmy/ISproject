import React, {useEffect, useState} from 'react';
import fetcher from "../../../utils/fetcher/fetcher";
import List from "../list/List";
import Modal from "../modal/Modal";
import modalClasses from "../student-list/studentList.module.css";
import classes from "../list/List.module.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


const headerName = `Список спеціальних курсів`
const labelHeader = ['id', 'Назва курсу', 'Аудиторія', 'Викладач','Кількість годин','Кількість кредитів']
const inputPlacelolder = 'Фільтрація по списку'

const SpecialCoursesList = () => {
    const [sCources, setSCourses] = useState<any>([])
    const [inputName, setInputName] = useState<string>('')
    const [isModal, setIsModal] = useState<boolean>(false)
    const [modalStatus, setModalStatus] = useState<'create' | 'update'>('create')
    const [sCourcesOnEdit, setSCourcesOnEdit] = useState<any>()

    const onDeleteHandler = (id: number) => {
        fetcher(`special-course/${id}`, {method: 'DELETE'})
            .then(data => {
                const newSCourses = sCources
                    .filter(student => student.id !== id)
                setSCourses(newSCourses)
            })
            .catch(e => {
                console.log(e)

            })
    }

    useEffect(() => {
        fetcher<any[]>(`special-course/list?q=${inputName}`)
            .then(data => {

                setSCourses(data)
            })
            .catch(e => {
            console.log(e)
        })
    }, [inputName])

    return (
        <div>
            {isModal && <SCoursesModal
                setIsModal={setIsModal}
                status={modalStatus}
                setSCourses={setSCourses}
                sCourse={sCourcesOnEdit}
            />}

            <List
                labelHeader={labelHeader}
                inputName={inputName}
                setIsModal={setIsModal}
                setInputName={setInputName}
                inputPlacelolder={inputPlacelolder}
                setModalStatus={setModalStatus}
                headerName={headerName}
            >
                {sCources.map(sCourse => {
                    return <div className={classes.item}>
                        {sCourse.id} | {sCourse.name}
                        |{sCourse.classroom}
                        | {sCourse.professor.name}
                        | {sCourse.hours}
                        | {sCourse.creditsAmount}
                        <span className={classes.icons}>
                        <EditIcon style={{color: 'black'}}
                                  onClick={() => {
                                      setModalStatus('update')
                                      setSCourcesOnEdit(sCourse);
                                      setIsModal(true)
                                  }}/>
                        <DeleteIcon style={{color: 'black'}} onClick={e => onDeleteHandler(sCourse.id)}/>
                    </span>
                    </div>
                })}


            </List>

        </div>
    );
};
type CreateModalProps = {
    status: 'create' | 'update'
    id?: string | number,
    setIsModal: any,
    setSCourses: any
    sCourse?: any

}
const SCoursesModal: React.FC<CreateModalProps> = (
    {
        sCourse,
        setSCourses,
        setIsModal,
        status,
        id
    }
) => {
    const actionName = status === 'create' ? 'Створити дисципліну' : 'Редагувати дисципліну'
    const [name, setName] = useState<string>(() => !!sCourse ? sCourse.name : '')
    const [hours, setрours] = useState<any>(() => !!sCourse ? sCourse.hours : '')
    const [credits, setCredits] = useState<any>(() => !!sCourse ? sCourse.creditsAmount : '')
    const [classroom, setClassroom] = useState<string>(() => !!sCourse ? sCourse.classroom : '')
    const [teachers, setTeachers] = useState<any[]>([])
    const [teacher, setTeacher] = useState<any>(() => !!sCourse ? sCourse.classroom : '')
    useEffect(() => {
        fetcher(`user/list/PROFESSOR`)
            .then((data:any)=>{
                setTeachers(data)
            })

    }, [])

    const onCreateHandler = () => {
        const body = {
            name: name,
            classroom: classroom,
            professorId: teacher?.id,
            hours:+hours,
            creditsAmount:+credits
        }
        fetcher('special-course/create', {
            method: 'POST',
            body: JSON.stringify(body)
        })
            .then(data => {
                if (data) {
                    setIsModal(false)
                    setSCourses(sCourses => [...sCourses, data])
                }
            })
            .catch(eeeee => {
                console.log(eeeee)
            })
    }
    const onUpdateHandler = () => {

        const body = {
            name: name,
            classroom: classroom,
            professorId: teacher?.id,
            hours:+hours,
            creditsAmount:+credits
        }
        fetcher<any>(`special-course/update/${sCourse.id}`, {
            method: 'PUT',
            body: JSON.stringify(body)
        })
            .then((data: any) => {
                setSCourses(sCurses => {
                    const newSCurses = sCurses.map(discipline => discipline.id !== data.id ? discipline : data)
                    return newSCurses
                })
                setIsModal(false)
            })
            .catch(eeeee => {
                console.log(eeeee)
            })

    }

    const onSelecthandler = (e: any) => {
        console.log(e)
        let teacher = teachers.find(i => +i.id === +e.target.value)
        setTeacher(teacher)
    }


    return <Modal
        setIsModal={setIsModal}
        onAction={status === 'create' ? onCreateHandler : onUpdateHandler}
        actionName={actionName}
    >
        <div className={modalClasses.wrapper}>
            <div className={modalClasses.leftSide}><span>Назва спеціального курсу</span></div>
            <div className={modalClasses.writeSide}>
                <input type="text" onChange={e => setName(e.target.value)} value={name} placeholder={'Назва дисципліни'}/>
            </div>
        </div>
        <div className={modalClasses.wrapper}>
            <div className={modalClasses.leftSide}><span>Аудиторія</span></div>
            <div className={modalClasses.writeSide}>
                <input type="text" onChange={e => setClassroom(e.target.value)} value={classroom} placeholder={'Назва дисципліни'}/>
            </div>
        </div>
        <div className={modalClasses.wrapper}>
            <div className={modalClasses.leftSide}><span>Кількість годин</span></div>
            <div className={modalClasses.writeSide}>
                <input type="text" onChange={e => setрours(e.target.value)} value={hours} placeholder={'Кількість годин'}/>
            </div>
        </div>
        <div className={modalClasses.wrapper}>
            <div className={modalClasses.leftSide}><span>Кількість кредитів</span></div>
            <div className={modalClasses.writeSide}>
                <input type="text" onChange={e => setCredits(e.target.value)} value={credits} placeholder={'Кількість годин'}/>
            </div>
        </div>
        <div className={modalClasses.wrapper}>
            <div className={modalClasses.leftSide}><span>Викладач</span></div>
            <div className={modalClasses.writeSide} defaultValue={teacher?.id}>
                <select className={modalClasses.inputStyle} onChange={e => onSelecthandler(e)}>
                    {teachers.map((localGroup: any) => (<option style={{height: '30px'}} value={localGroup.id}>{localGroup.name}</option>))}
                </select>
            </div>
        </div>



    </Modal>
}


export default SpecialCoursesList;