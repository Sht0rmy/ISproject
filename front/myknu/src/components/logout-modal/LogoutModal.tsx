import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function LogoutAlert({handleLogout, handleClose, openLogoutAlert}: any) {
    return (
        <React.Fragment>
            <Dialog
                open={openLogoutAlert}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Ви дійсно бажаєте закінчити сесію?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} color="error">Скасувати</Button>
                    <Button onClick={handleLogout} color="success" autoFocus>
                        Підтвердити
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}