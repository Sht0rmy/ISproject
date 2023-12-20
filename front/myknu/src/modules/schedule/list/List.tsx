import React from 'react';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import classes from './List.module.css'
import {useUser} from "../../../contexts/UserContext";
import {UserRoleType} from "../../../types/user-type";

export type Filed = { value: string | number, idName: string, askLabel: string, label: string, id: number }


type ListProps = {
    inputName: string,
    headerName: string,
    createLabel?: any,
    children?: any
    labelHeader: any,
    setModalStatus: any,
    setIsModal: any,
    setInputName: any
    inputPlacelolder: string
}


const List: React.FC<ListProps> = ({
                                       inputName,
                                       headerName,
                                       children,
                                       labelHeader,
                                       setModalStatus,
                                       setIsModal,
                                       setInputName,
                                       inputPlacelolder
                                   }
) => {

    const createItemHandler = () => {
        setModalStatus('create')
        setIsModal(true)
    }

    const {userRole} = useUser();

    return (
        <div className={classes.modal} style={{}}>
            <div className={classes.header} style={{}}>
                <div>{headerName}</div>
            </div>

            <div className={classes.inputWrapper}>
                <input className={classes.input}
                       type="text"
                       placeholder={inputPlacelolder}
                       value={inputName}
                       onChange={e => setInputName(e.target.value)}
                />
            </div>

            <div className={classes.listWrapper}>

                <div className={classes.labelsWrapper}>{labelHeader.map((item: any) => (<span>{item}| </span>))}</div>

                <div className={classes.labelsWrapper}>
                    {children}
                </div>

            </div>


            <div className={classes.addWrapper}>
                {userRole === UserRoleType.Admin && (
                    <AddOutlinedIcon onClick={createItemHandler} style={{cursor: "pointer"}}/>
                )}
            </div>

</div>

)
    ;
};

export default List;