import React, {useEffect, useState} from 'react';
import EmptyPage from '../../../components/empty-page/EmptyPage';
import fetcher from "../../../utils/fetcher/fetcher";
import List, {Filed} from "../list/List";
// import Edit from
// export type Filed={value:string|number,id:string,askLabel:string,label:string}

// type list2

// type GroupSchedule = Filed[][]
const GroupScheduleNames: Filed[][] =[[
    {id:0,idName: 'id',askLabel:'Введіть id',value:'',label:'id',},
    {id:0,idName: 'disciplineId', askLabel: 'Оберіть id Дисципліни', value: '',label:'id Дисципліни' },
    {id:0,idName: 'disciplineName', askLabel: 'Оберіть назву Дисципліни', value: '' ,label:'Назва'},
    {id:0,idName: 'weekDay', askLabel: 'Оберіть день тижня', value: '' ,label:'День тижня'},
    {id:0,idName: 'lessonNumber', askLabel: 'Оберіть № заняття', value: '' ,label:'№ пари'},
    {id:0,idName: 'group', askLabel: 'Оберіть групу', value: '' ,label:'Група'},
    {id:0,idName: 'teacher', askLabel: 'Оберіть викладача', value: '' ,label:'Викладач'},
    // { name: 'type', askLabel: 'Тип', value: '' ,label:'id'},
    {id:0,idName: 'roomNumber', askLabel: 'Введіть № аудиторії', value: '',label:'№ аудиторії' },
]]


const labels = GroupScheduleNames

const inputName = `Фільтрація по списку`
const headerName = `Список розкладу груп`

const getUrl=''
const AdminScheduleControl = () => {

    const [groupSchedule,setGroupSchedule] = useState<any[]>([])

    if (!groupSchedule.length) {
        return <EmptyPage/>
    }

    // useEffect(()=>{
    //     fetcher('discipline/list').then((data:any)=>{
    //
    //         console.log(data)
    //     }).catch(e=>{
    //         console.log(e)
    //     })
    // },[])




    return (null
        // <List headerName={headerName} inputName={inputName} list={labels} getUrl={getUrl}/>
);
};

export default AdminScheduleControl;