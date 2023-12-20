import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from "./App";
import {UserProvider} from './contexts/UserContext';
import {SnackbarProvider} from 'notistack'
import { DefaultScheduleContextProvider } from './contexts/DefaultScheduleContext';


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <SnackbarProvider>
        <UserProvider>
            <DefaultScheduleContextProvider>
                <App/>
            </DefaultScheduleContextProvider>
        </UserProvider>
    </SnackbarProvider>
);

reportWebVitals();
