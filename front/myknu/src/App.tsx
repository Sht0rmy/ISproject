import React, {useState} from 'react';
import './App.css';
import {Header} from "./components/Header";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import DefaultSchedule from "./modules/schedule/student-teacher-schedule/DefaultSchedule";
import Login from "./login/Login";
import AdminScheduleControl from "./modules/schedule/admin-chedule-control2/AdminScheduleControl";
import StudentSpecialCourse from './modules/studentSpecialCourse/StudentSpecialCourse';
import StudentList from "./modules/schedule/student-list/studentList";
import TeachersList from "./modules/schedule/teacher-list/Teachers-list";
import AdminPanel from './modules/admin-panel/AdminPanel';
import {DefaultScheduleContextProvider} from "./contexts/DefaultScheduleContext";
import {useUser} from "./contexts/UserContext";
import {UserRoleType} from "./types/user-type";
import Disciplines from "./modules/disciplines/disciplines";
import SpecialCoursesList from "./modules/schedule/special-courses-list/SpecialCoursesList";
import CourseListeners from "./modules/course-listeners/CourseListeners";
import CheduleList from "./modules/schedule/chedule-list";

function App() {

    const {userRole} = useUser();
    const isAdmin = userRole === UserRoleType.Admin
    const isStudentOrProfessor = userRole === UserRoleType.Professor || userRole === UserRoleType.Student
    const isStudent = userRole === UserRoleType.Student;
    const isProfessor = userRole === UserRoleType.Professor;

    const [isAuth, setIsAuth] = useState<boolean>(() => {
        const isAuth = localStorage.getItem('isAuth')

        return !!isAuth
    })

    const defaultComponentForRoles = userRole === UserRoleType.Admin ? AdminScheduleControl : DefaultSchedule

    return (
            <div>
                <BrowserRouter>
                    {!isAuth && <Login setIsAuth={setIsAuth}/>}

                    <div className="app-container">
                        <Header/>
                        <main>
                            <Switch>
                                {
                                    isAdmin && (
                                        <Route path='/admin-panel' component={AdminPanel}/>
                                    )
                                }
                                {isAdmin && (
                                    <Route path='/adminScheduleControl' component={CheduleList}/>
                                )}
                                {(isProfessor || isAdmin) && (
                                    <Route path='/students-list' component={StudentList}/>
                                )}
                                <Route path='/teacher-list' component={TeachersList}/>
                                {
                                    isStudent && (
                                        <Route path='/special-curses' component={StudentSpecialCourse}/>
                                    )
                                }
                                {
                                    (isStudentOrProfessor) && (
                                        <Route path='/schedule' component={DefaultSchedule}/>
                                    )
                                }
                                <Route path='/discipline' component={Disciplines}/>
                                <Route path='/special-courses-list' component={SpecialCoursesList}/>
                                <Route path='/course-listeners-list' component={CourseListeners}/>
                                <Route path={'/'} component={defaultComponentForRoles}/>
                            </Switch>
                        </main>
                    </div>
                </BrowserRouter>
            </div>
    );
}

export default App;
