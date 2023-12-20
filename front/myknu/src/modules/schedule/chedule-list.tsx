import React, {useEffect, useState} from 'react';
import fetcher from "../../utils/fetcher/fetcher";
import List from "./list/List";
import Modal from "./modal/Modal";
import modalClasses from "./student-list/studentList.module.css";
import classes from "./list/List.module.css";
import {UserRoleType} from "../../types/user-type";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


const headerName = `Список розкладу груп`
const labelHeader = ['id', 'Id Дисципліни', 'Назва', 'День тижня', '№ групи', 'Викладач','Тип','№ аудиторії']
const inputPlacelolder = 'Фільтрація по списку'


const CheduleList = () => {
    const [schedules,setSchedules]=useState<any>([])
    const [isModal, setIsModal] = useState<boolean>(false)
    const [modalStatus, setModalStatus] = useState<'create' | 'update'>('create')
    const [schedulesOnEdit, setSchedulesOnEdit] = useState<any>()
    const [inputName, setInputName] = useState<string>('')

    useEffect(() => {
        fetcher<any>(`group-schedule/list?name=${inputName}`)
            .then(data => {

                setSchedules(data)
            })
    }, [inputName])
    const onDeleteHandler = (id: number) => {
        fetcher(`user/delete/${id}`, {method: 'DELETE'})
            .then(data => {
                const newItems = schedules.filter(student => student.id !== id)
                setSchedules(newItems)

            }).catch(e => {
            console.log(e)

        })
    }

    return (
        <div>
            {isModal && <GroupModal
                schedule={schedulesOnEdit}
                setSchedules={setSchedules}
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
                    {schedules.map(schedule => {
                        return <div className={classes.item}>
                            {schedule.id} | {schedule?.discipline?.name}
                            |{schedule?.group?.name}
                            | {schedule?.professor?.name}
                            | {schedule.type}
                            | {schedule.classroom}
                            <span className={classes.icons}>
                               { (<>
                                   <EditIcon style={{color: 'black'}}
                                             onClick={() => {
                                                 setModalStatus('update')
                                                 setSchedulesOnEdit(schedule);
                                                 setIsModal(true)
                                             }}/>
                                   <DeleteIcon style={{color: 'black'}} onClick={e => onDeleteHandler(schedule.id)}/>
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
    setSchedules: any
    schedule?: any

}

const GroupModal:React.FC<CreateModalProps> = ({setIsModal,setSchedules,schedule,status})=>{

    const [groups,setGroups]=useState<any>([])
    const [disciplines,setDisciplines]=useState<any>([])
    const [teachers,setTeachers] = useState<any>([])
    const [classRoom,setClassRoom] = useState<string>(()=>schedule ? schedule.classroom : undefined)
    const [types,setTypes]=useState([
        {id:'lecture',name:'Лекція'},
        {id:'practice',name:'практика'}]
    )
    const [day,setDay]=useState<any>(()=>schedule ? schedule.weekDay : undefined)


    const [lessonNumber,setLessonNumber]=useState<string>(()=>schedule ? schedule.lessonNumber : undefined)

    const [discipline,setDiscipline] = useState<any>(()=>schedule ? schedule.discipline : undefined)
    const [group,setGroup] = useState<any>(()=>schedule ? schedule.group : undefined)
    const [teacher,setTeacher] = useState<any>(()=>schedule ? schedule.professor : undefined)
    const actionName = status === 'create' ? 'Створити графік' : 'Редагувати графік'


    let type2
    if(schedule?.type){
        if(schedule.type==='lecture'){
            type2 = {id:'lecture',name:'Лекція'}
        }else {
            type2 = {id:'practice',name:'практика'}
        }
    }

    const [type,setType]=useState<any>(()=>schedule ? type2 : undefined)

    const [days,setDays]=useState<any>([
        {id:'monday',name:'Понеділок'},
        {id:'tuesday',name:'Вівторок'},
        {id:'wednesday',name:'Середа'},
        {id:'thursday',name: 'Четвер'},
        {id:'friday',name:'П\'ятниця'},
        {id:'saturday',name:'Субота'},
        {id:'sunday',name:'Неділя'},
    ])


    const onCreateHandler = () => {

        const body = {
            weekDay: day.id,
            lessonNumber: lessonNumber,
            type: type.id,
            classroom: classRoom,
            disciplineId:discipline?.id,
            groupId:group?.id,
            professorId:teacher?.id,

        }
        console.log(discipline)


        fetcher('group-schedule/create', {
            method: 'POST',
            body: JSON.stringify(body)
        })
            .then(data => {
                setIsModal(false)
                setSchedules(schedules => {
                    let newData= [...schedules, data]

                    return newData
                })
            })
            .catch(eeeee => {
                console.log(eeeee)
            })
    }
    const onUpdateHandler = () => {

        const body = {
            weekDay: day.id,
            lessonNumber: lessonNumber,
            type: type.id,
            classroom: classRoom,
            disciplineId:discipline?.id,
            groupId:group?.id,
            professorId:teacher?.id,
        }
        fetcher<any>(`group-schedule/update/${schedule.id}`, {
            method: 'PUT',
            body: JSON.stringify(body)
        })
            .then(() => {
                setSchedules(items => {
                    const newItems = items.map(localItem => localItem.id !== schedule.id ? localItem : {...localItem,...body})
                    return newItems
                })
                setIsModal(false)
            })
            .catch(eeeee => {
                console.log(eeeee)
            })

    }

    const onSelectGrouphandler = (e: any) => {
        let group = groups.find(i => +i.id === +e.target.value)
        setGroup(group)
    }
    const onSelectDisciplineHandler = (e: any) => {
        let newDiscipline = disciplines.find(i => +i.id === +e.target.value)
        setDiscipline(newDiscipline)
    }
    const onSelectTeacherHandler = (e: any) => {
        let newTeacher = teachers.find(i => +i.id === +e.target.value)
        setTeacher(newTeacher)
    }
    const setTypesHandler = (e: any) => {
        let newType = types.find(i => i.id === e.target.value)
        setType(newType)
    }
    const onSelectDayHandler = (e: any) => {
        let newDay = days.find(i => i.id === e.target.value)
        setDay(newDay)
    }

    useEffect(()=>{
        fetcher(`group/list`)
            .then(data=>{
                setGroups(data)
            })
        fetcher(`discipline/list`)
            .then(data=>{
                setDisciplines(data)
            })
        fetcher(`user/list/PROFESSOR`)
            .then(data=>{
                setTeachers(data)
            })
    },[])

    return <Modal
    actionName={actionName}
    setIsModal={setIsModal}
    onAction={status === 'create' ? onCreateHandler : onUpdateHandler}>

        <div className={modalClasses.wrapper}>
            <div className={modalClasses.leftSide}><span>Група</span></div>
            <div className={modalClasses.writeSide} >
                <select style={ !group?{backgroundColor:'red'}:{}}  className={modalClasses.inputStyle} onChange={e => onSelectGrouphandler(e)}>
                    <option style={{height: '30px'}} value={group?.id}>{group?.name}</option>
                    {groups.map((localItem: any) => (<option style={{height: '30px'}} value={localItem.id}>{localItem.name}</option>))}
                </select>
            </div>
        </div>

        <div className={modalClasses.wrapper}>
            <div className={modalClasses.leftSide}><span>Дисципліна</span></div>
            <div className={modalClasses.writeSide} defaultValue={discipline?.id ||undefined}>
                <select style={ !discipline?{backgroundColor:'red'}:{}} className={modalClasses.inputStyle} onChange={e => onSelectDisciplineHandler(e)}>
                    <option style={{height: '30px'}} value={discipline?.id}>{discipline?.name}</option>

                    {disciplines.map((localItem: any) => (<option style={{height: '30px'}} value={localItem.id}>{localItem.name}</option>))}
                </select>
            </div>
        </div>

        <div className={modalClasses.wrapper}>
            <div className={modalClasses.leftSide}><span>Викладач</span></div>
            <div className={modalClasses.writeSide} defaultValue={teacher?.id ||undefined}>
                <select style={ !teacher?{backgroundColor:'red'}:{}} className={modalClasses.inputStyle} onChange={e => onSelectTeacherHandler(e)}>
                    <option style={{height: '30px'}} value={teacher?.id}>{teacher?.name}</option>

                    {teachers.map((localItem: any) => (<option style={{height: '30px'}} value={localItem.id}>{localItem.name}</option>))}
                </select>
            </div>
        </div>
        <div className={modalClasses.wrapper}>
            <div className={modalClasses.leftSide}><span>Тип</span></div>
            <div className={modalClasses.writeSide} defaultValue={type?.id}>
                <select style={ !type?{backgroundColor:'red'}:{}} className={modalClasses.inputStyle} onChange={e => setTypesHandler(e)}
                defaultValue={type?.id}
                >
                    <option  value={type?.id}>{type?.name}</option>
                    {types.map((localType: any) => (
                        <option  value={localType.id}>{localType.name}</option>
                    ))}
                </select>
            </div>
        </div>
        <div className={modalClasses.wrapper}>
            <div className={modalClasses.leftSide}><span>№ аудиторії</span></div>
            <div className={modalClasses.writeSide}>
                <input type="text"
                       style={{height: '45px',width:"98%"}}
                       className={modalClasses.inputStyle}
                       onChange={e => setClassRoom(e.target.value)}
                       value={classRoom} placeholder={'Виберіть № аудиторії'}/>
            </div>
        </div>
        <div className={modalClasses.wrapper}>
            <div className={modalClasses.leftSide}><span>День тижня </span></div>
            <div className={modalClasses.writeSide} defaultValue={day?.id}>

                <select className={modalClasses.inputStyle} style={!day?{backgroundColor:'red'}:{}} onChange={e => onSelectDayHandler(e)}
                        defaultValue={day?.id}
                >
                    <option  value={type?.id}>{type?.name}</option>
                    {days.map((localItem: any) => (
                        <option key={localItem.id} style={{height: '30px'}} value={localItem.id}>
                            {localItem.name}
                    </option>))}
                </select>
            </div>
        </div>



    </Modal>
}


export default CheduleList;