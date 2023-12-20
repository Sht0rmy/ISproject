import React, { useEffect, useState } from 'react';
import { Box, Button, Modal } from "@mui/material";

import classes from './login.module.css'
import fetcher from "../utils/fetcher/fetcher";
import { useHistory } from "react-router-dom";
import {useUser} from "../contexts/UserContext";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
};


const Login = ({ setIsAuth, setOpen }: any) => {

    const [popupState, setPopupState] = useState<'login' | 'auth'>('login')


    return (
        <form className={classes.form} >
            <Modal
                className={classes.modalRoot}
                open={true}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box
                    style={{ borderRadius: '14px' }}
                    sx={{ ...style, width: 400 }}>
                    <div className={classes.boxDiv}>
                        <div
                            style={{
                                alignItems: "center",
                                justifySelf: 'center',
                                flexGrow: 1,
                                borderBottom: '1px black solid'
                            }}
                            onClick={() => {setPopupState('login')}}
                            className={popupState === 'auth' ? classes.revertColor : classes.normalColor}
                        >
                            Реєстрація
                        </div>
                        <div
                            style={{ flexGrow: 1 }}
                            onClick={() => {setPopupState('auth')}}
                            className={popupState === 'login' ? classes.revertColor : classes.normalColor}
                        >
                            Авторизація
                        </div>

                    </div>
                    <div
                        className={classes.modalFieldsContainer}>
                        {popupState === 'login'
                            ? <LoginComponent setIsAuth={setIsAuth} />
                            : <AuthComponent setIsAuth={setIsAuth} />}
                    </div >
                </Box >
            </Modal >
        </form >
    );
};

const LoginComponent = ({ setIsAuth }: any) => {
    const history = useHistory();
    const {setUserRole} = useUser()

    const [name, setName] = useState<any>('')
    const [email, setEmail] = useState<any>('')
    const [pass, setPass] = useState<any>()
    const [passAggain, setPassAggain] = useState<any>()
    const [type, setType] = useState<any>()
    const [groopId, setGroopId] = useState<any>()

    const [errorText, setErrorText] = useState<any>()
    const [groops, setGroops] = useState<any>()
    const types = ['Викладач', 'Студент', 'Адміністратор']

    const onSubmitHandler = (e: any) => {
        e.preventDefault()
        if (pass !== passAggain) {
            setErrorText('Підтвердіть пароль')
        }
        let body = {
            name: name,
            email: email,
            password: pass,
            type: type,
            groupId: groopId
        }

        if (body.type === 'Викладач') {
            body.type = 'PROFESSOR'
            body.groupId = undefined
        }

        if (body.type === 'Студент') {
            body.type = 'STUDENT'
        }

        if (body.type === 'Адміністратор') {
            body.type = 'ADMIN'
        }


        fetcher<{ token: string, type: string, user: any }>(`auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }).then((data) => {
            console.log(":: -> data", data);
            localStorage.setItem('isAuth', 'true')
            const token = data?.token.split(' ')[1]
            localStorage.setItem('token', token)
            localStorage.setItem('role', data.user.type)
            localStorage.setItem('user_id', data.user.id)
            localStorage.setItem('user_email', data.user.email)
            setUserRole(data.user.type)
            setIsAuth(true)
        }).catch(e => {
            console.log(e)
        })    }

    useEffect(() => {
        fetcher('group/list')
            .then((data: any) => {
                setGroops(data)
            }).catch(e => {
                console.log(e)
            })
    }, [])


    return (<>
        <input
            onChange={e => setName(e?.target?.value)}
            type="text"
            value={name}
            placeholder={`Прізвище та ім\'я`}
            className={classes.customInput}
        />
        <input
            onChange={e => setEmail(e.target.value)}
            type="email"
            value={email}
            placeholder={`Е-mail`}
            className={classes.customInput}
        />
        <input
            onChange={e => setPass(e.target.value)}
            type="password"
            value={pass}
            placeholder={`Пароль`}
            className={classes.customInput}
        />
        <input
            onChange={e => setPassAggain(e.target.value)}
            type="password"
            value={passAggain}
            placeholder={`Підтвердити пароль`}
            className={classes.customInput}
        />
        <select onChange={e => setType(e.target.value)} className={classes.customInput}>
            <option value="">Викладач/студент</option>
            {types.map((option: any) => {
                return <option value={option}>{option}</option>
            })}
        </select>
        <select onChange={e => {
            setGroopId(e.target.value)
        }} className={classes.customInput}>
            <option value="">Група</option>
            {groops?.map((option: any) => {
                return <option style={{ color: 'white' }} value={option.id}>{option.name}</option>
            })}
        </select>
        {!!errorText && <span style={{ backgroundColor: 'red' }}>{errorText}</span>}

        <Button
            style={{
                backgroundColor: 'green',
                color: 'white',
                padding: '10px',
                borderRadius: '10px',
                marginTop: '20px '
            }}
            className={classes.button}
            onClick={onSubmitHandler}
            type={'submit'}
        >
            Реєстрація
        </Button>
    </>)
}
const AuthComponent = ({ setIsAuth }: any) => {
    const { setUserRole} = useUser()

    const history = useHistory();

    const [email, setEmail] = useState<any>('')
    const [pass, setPass] = useState<any>(``)

    const onSubmitHandler = (e: any) => {
        e.preventDefault()
        let body = {
            email: email,
            password: pass,
        }
        fetcher<string>(`auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),

        }).then((data: any) => {
            localStorage.setItem('isAuth', 'true')
            const token = data.token.split(' ')[1]
            localStorage.setItem('token', token)
            localStorage.setItem('role', data.user.type)
            localStorage.setItem('user_id', data.user.id)
            localStorage.setItem('user_email', data.user.email)
            setUserRole(data.user.type)

            setIsAuth(true)
            history.push("/");
        }).catch(e => {
            console.log(e)
        })
    }



    return (<>
        <input
            onChange={e => setEmail(e.target.value)}
            type="text"
            value={email}
            placeholder={`Е-mail`}
            className={classes.customInput}
        />
        <input
            onChange={e => setPass(e.target.value)}
            type="password"
            value={pass}
            placeholder={`Пароль`}
            className={classes.customInput}
        />

        <Button
            style={{
                backgroundColor: 'green',
                color: 'white',
                padding: '10px',
                borderRadius: '10px',
                marginTop: '20px '
            }}

            className={classes.button}
            onClick={onSubmitHandler}
            type={'submit'}
        >
            Увійти
        </Button>

    </>)
}




export default Login;