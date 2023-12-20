import React, {ChangeEvent, useState} from 'react';

import classes from './List.module.css'
import {Filed} from "./List";

type CreatingProps ={
    list:Filed[][]

}
const Creating:React.FC<CreatingProps> = ({list:listProps}) => {

    const [list,setList]=useState<Filed[][]>(listProps)
    console.log(list)

    const onChangeHandler =(e: ChangeEvent<HTMLInputElement>,item:Filed)=>{
        // let newList = list.map(localItem=>localItem.id!==item.id?localItem:{
        //     ...item,value:e.target.value
        // })
        // setList(newList)
    }



    return (
        <div className={classes.creatingWrapper}>
            <div className={classes.creatingModal}>

                {list[0].map((item:Filed)=>{
                    return(
                        <div className={classes.creatingModalItem}>
                            <span>{item.label}</span>
                            <input className={classes.creatingInput} onChange={e=>onChangeHandler(e,item)} type='text' placeholder={item.askLabel}></input>
                        </div>
                    )
                }) }
                <span className={classes.postContainer}><div>Додати</div></span>
            </div>
        </div>
    );
};

export default Creating;