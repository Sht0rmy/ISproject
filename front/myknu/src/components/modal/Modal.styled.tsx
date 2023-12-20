import {styled} from "@mui/material/styles";

export const CustomBox = styled('header')(({}) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    background: 'white',
    borderRadius: '5px',
    boxShadow: '24px',
    padding: 40
}))