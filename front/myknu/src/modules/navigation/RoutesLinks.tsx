import React, { useState } from 'react';
import { Button, Menu, MenuItem, Tooltip } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { UserRoleType } from '../../types/user-type';
import LogoutAlert from '../../components/logout-modal/LogoutModal';

const btnStyles = {
    background: 'black',
    color: 'white',
    '&:hover': {
        background: 'grey',
        color: 'white',
    },
};

export const RouteLinks: React.FC = () => {
    const { userRole, setUserRole } = useUser();
    const [openLogoutAlert, setOpenLogoutAlert] = React.useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClickOpen = () => {
        setOpenLogoutAlert(true);
    };

    const handleClose = () => {
        setOpenLogoutAlert(false);
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const isAdmin = userRole === UserRoleType.Admin;
    const isStudentOrProfessor =
        userRole === UserRoleType.Professor || userRole === UserRoleType.Student;
    const isStudent = userRole === UserRoleType.Student;
    const isProfessor = userRole === UserRoleType.Professor;

    const handleLogout = () => {
        localStorage.removeItem('isAuth');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        window.location.reload();
    };

    return (
        <>
            <LogoutAlert
                handleLogout={handleLogout}
                openLogoutAlert={openLogoutAlert}
                handleClose={handleClose}
            />

            {isAdmin && (
                <Button sx={btnStyles} color="primary" variant="contained">
                    <NavLink
                        style={{ textDecoration: 'none', color: 'white' }}
                        to="/adminScheduleControl"
                    >
                        Керування розкладом
                    </NavLink>
                </Button>
            )}

            {isAdmin && (
                <>
                    <Tooltip title="Адміністрування" arrow>
                        <Button
                            sx={btnStyles}
                            color="primary"
                            variant="contained"
                            onClick={handleMenuClick}
                        >
                            Адміністрування
                        </Button>
                    </Tooltip>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem>
                            <Button
                                sx={btnStyles}
                                color="primary"
                                variant="contained"
                            >
                                <NavLink
                                    style={{ textDecoration: 'none', color: 'white' }}
                                    to="/teacher-list"
                                >
                                    Список Викладачів
                                </NavLink>
                            </Button>
                        </MenuItem>

                        <MenuItem>
                            <Button
                                sx={btnStyles}
                                color="primary"
                                variant="contained"
                            >
                                <NavLink
                                    style={{ textDecoration: 'none', color: 'white' }}
                                    to="/students-list"
                                >
                                    Список студентів
                                </NavLink>
                            </Button>
                        </MenuItem>

                        <MenuItem>
                            <Button
                                sx={btnStyles}
                                color="primary"
                                variant="contained"
                            >
                                <NavLink
                                    style={{ textDecoration: 'none', color: 'white' }}
                                    to="/discipline"
                                >
                                    Список дисциплін
                                </NavLink>
                            </Button>
                        </MenuItem>
                        <MenuItem>
                            <Button
                                sx={btnStyles}
                                color="primary"
                                variant="contained"
                            >
                                <NavLink
                                    style={{ textDecoration: 'none', color: 'white' }}
                                    to="/special-courses-list"
                                >
                                    Список спеціальних курсів
                                </NavLink>
                            </Button>
                        </MenuItem>
                        <MenuItem>
                            <Button
                                sx={btnStyles}
                                color="primary"
                                variant="contained"
                            >
                                <NavLink
                                    style={{ textDecoration: 'none', color: 'white' }}
                                    to="/course-listeners-list"
                                >
                                    список студентів на спеціальних курсах
                                </NavLink>
                            </Button>
                        </MenuItem>
{/*
                        <MenuItem>
                            <Button
                                sx={btnStyles}
                                color="primary"
                                variant="contained"
                            >
                                <NavLink
                                    style={{ textDecoration: 'none', color: 'white' }}
                                    to="/schedule-group-list"
                                >
                                    Список розкладу груп
                                </NavLink>
                            </Button>
                        </MenuItem>
*/}

                    </Menu>
                </>
            )}

            {(isStudentOrProfessor) && (
                <Button sx={btnStyles} color="primary" variant="contained">
                    <NavLink style={{ textDecoration: 'none', color: 'white' }} to="/">
                        Розклад
                    </NavLink>
                </Button>
            )}

            {!isAdmin && (
                <Button
                    sx={btnStyles}
                    color="primary"
                    variant="contained"
                >
                    <NavLink
                        style={{ textDecoration: 'none', color: 'white' }}
                        to="/teacher-list"
                    >
                        Список Викладачів
                    </NavLink>
                </Button>
            )}

            {isProfessor && (
                <Button sx={btnStyles} color="primary" variant="contained">
                    <NavLink
                        style={{textDecoration: 'none', color: 'white'}}
                        to="/students-list"
                    >
                        Список студентів
                    </NavLink>
                </Button>
            )}

            {!isAdmin && (
                <Button sx={btnStyles} color="primary" variant="contained">
                    <NavLink
                        style={{textDecoration: 'none', color: 'white'}}
                        to="/discipline"
                    >
                        Дисципліни
                    </NavLink>
                </Button>
            )}

            {(isStudent && !isAdmin) && (
                <Button sx={btnStyles} color="primary" variant="contained">
                    <NavLink
                        style={{textDecoration: 'none', color: 'white'}}
                        to="/special-curses"
                    >
                        Спеціальні курси
                    </NavLink>
                </Button>
            )}

            <Button
                sx={btnStyles}
                color="primary"
                variant="contained"
                onClick={handleClickOpen}
            >
                Вихід
            </Button>
        </>
    );
};
