import React, {useEffect, useState} from 'react';
import fetcher from "../../utils/fetcher/fetcher";
import List from "../schedule/list/List";
import classes from "../schedule/list/List.module.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "../schedule/modal/Modal";
import modalClasses from "../schedule/student-list/studentList.module.css";



const headerName = `Список дисциплін`
const labelHeader = ['id', 'Назва дисципліни', 'Кількість годин', 'Кількість кредитів']
const inputPlacelolder = 'Фільтрація по списку'
type Discipline ={
    id:number
    name: string;
    amountOfHours: number;
    amountOfCredits: number;

}

const Disciplines = () => {
    const [inputName, setInputName] = useState<string>('')
    const [disciplines, setDisciplines] = useState<Discipline[]>([])
    const [isModal, setIsModal] = useState<boolean>(false)
    const [modalStatus, setModalStatus] = useState<'create' | 'update'>('create')
    const [disciplineOnEdit, setSDisciplineOnEdit] = useState<any>()

    const onDeleteHandler = (id: number) => {
        fetcher(`discipline/delete/${id}`, {method: 'DELETE'})
            .then(data => {
                const newDisciplines = disciplines.filter(student => student.id !== id)
                setDisciplines(newDisciplines)

            }).catch(e => {
            console.log(e)

        })
    }
    useEffect(() => {
        fetcher<any[]>(`discipline/list?q=${inputName}`)
            .then(data => {

                setDisciplines(data)
                console.log(data)
            }).catch(e=>{
            console.log(e)

        })
    }, [inputName])


    return (
        <div>
            {isModal&& <DisciplineModal
            setIsModal={setIsModal}
            status={modalStatus}
            setDisciplines={setDisciplines}
            discipline={disciplineOnEdit}
            />}
        <List
            labelHeader={labelHeader}
            inputName={inputName} headerName={headerName}
              setModalStatus={setModalStatus}
              setIsModal={setIsModal}
              setInputName={setInputName}
              inputPlacelolder={inputPlacelolder}
        >
            {disciplines.map(discipline => {
                return <div className={classes.item}>
                    {discipline.id} | {discipline.name}
                    |{discipline.amountOfHours}
                    | {discipline.amountOfCredits}
                    <span className={classes.icons}>
                        <EditIcon style={{color: 'black'}}
                                  onClick={() => {
                                      setModalStatus('update')
                                      setSDisciplineOnEdit(discipline);
                                      setIsModal(true)
                                  }}/>
                        <DeleteIcon style={{color: 'black'}} onClick={e => onDeleteHandler(discipline.id)}/>
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
    setDisciplines: any
    discipline?: any

}

const DisciplineModal: React.FC<CreateModalProps> =({discipline,setDisciplines,setIsModal,status,id})=>{

    const actionName = status === 'create' ? 'Створити дисципліну' : 'Редагувати дисципліну'
    const [name, setName] = useState<string>(() => !!discipline ? discipline.name : '')
    const [hours, setрours] = useState<any>(() => !!discipline ? discipline.amountOfHours : '')
    const [credits, setCredits] = useState<any>(() => !!discipline ? discipline.amountOfCredits : '')

    const onCreateHandler = () => {
        const body = {
            name: name,
            amountOfCredits:+credits,
            amountOfHours:+hours
        }
        fetcher('discipline/create', {
            method: 'POST',
            body: JSON.stringify(body)
        })
            .then(data => {
                if(data){
                    setIsModal(false)
                    setDisciplines(disciplines => [...disciplines, data])

                }
            })
            .catch(eeeee => {
                console.log(eeeee)
            })
    }
    const onUpdateHandler = () => {

        const body = {
            name: name,
            amountOfCredits:credits,
            amountOfHours:hours
        }
        fetcher<any>(`discipline/update/${discipline.id}`, {
            method: 'PUT',
            body: JSON.stringify(body)
        })
            .then((data: any) => {
                setDisciplines(disciplines => {
                    const newDisciplines = disciplines.map(discipline => discipline.id !== data.id ? discipline : data)
                    return newDisciplines
                })
                setIsModal(false)
            })
            .catch(eeeee => {
                console.log(eeeee)
            })

    }


    return <Modal
    setIsModal={setIsModal}
    onAction={status === 'create' ? onCreateHandler : onUpdateHandler}
    actionName={actionName}
    >
        <div className={modalClasses.wrapper}>
            <div className={modalClasses.leftSide}><span>Назва дисципліни</span></div>
            <div className={modalClasses.writeSide}>
                <input type="text" onChange={e => setName(e.target.value)} value={name} placeholder={'Назва дисципліни'}/>
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

    </Modal>
}

export default Disciplines;