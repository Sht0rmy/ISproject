import React from 'react';
import classes from "./modal.module.css";
import {Button} from "@mui/material";

type ModalProps = {
    children?: any
    actionName: string,
    setIsModal:any,
    onAction:any
}
const Modal: React.FC<ModalProps> = ({children,actionName,setIsModal,onAction}) => {

    return <div className={classes.modalWrapper}>
        <div className={classes.modal}>
            <div>

                {children}
            </div>
            <div className={classes.action}>
                <Button
                    onClick={onAction}
                    variant={'contained'}
                    color={'success'}>
                    {actionName}
                </Button>
                <Button
                    onClick={e=>setIsModal(false)}
                    classes={classes.closeModal}
                    variant={'contained'}
                    color={'success'}>
                    Закрити
                </Button>
            </div>

        </div>
    </div>
}

export default Modal;