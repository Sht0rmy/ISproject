import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {CustomBox} from "./Modal.styled";
import {useUser} from "../../contexts/UserContext";
import { UserRoleType } from '../../types/user-type';

export default function BasicModal({teacherName, discipline, roomNo, type, groupName}: any) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const {userRole} = useUser();

    const isProfessor = userRole === UserRoleType.Professor;

    return (
        <div>
            <Button onClick={handleOpen}>Переглянути</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <CustomBox>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        <b>Ім'я викладача:</b> {teacherName}
                    </Typography>
                    <Typography id="modal-modal-discipline" sx={{mt: 2}}>
                        <b>Назва дисципліни:</b> {discipline}
                    </Typography>
                    <Typography id="modal-modal-student-group" sx={{mt: 2}}>
                        <b>Назва групи:</b> {groupName}
                    </Typography>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 50}}>
                        <Typography id="modal-modal-auditory" sx={{mt: 2}}>
                            <b>№ Аудиторії:</b> {roomNo}
                        </Typography>
                        {isProfessor && (
                            <Typography id="modal-modal-sub-group" sx={{mt: 2}}>
                                <b>Підгрупа:</b>
                            </Typography>
                        )}
                        <Typography id="modal-modal-type" sx={{mt: 2}}>
                            <b>Тип:</b> {type}
                        </Typography>
                    </div>
                </CustomBox>
            </Modal>
        </div>
    );
}