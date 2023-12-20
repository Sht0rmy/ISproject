import {styled} from "@mui/material/styles";

export const SelectBlockWrapper = styled('div')(({}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: 'white',
    // width: '848px',
    width: '70%',
    height: '120px',
    margin: '50px auto',
    borderRadius: '20px'
}))

export const SelectTitleWrapper = styled('div')(({}) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'black',
    height: '50%',
    borderRadius: '20px 20px 0px 0px'
}))
export const SelectTeacherGroupTitle = styled('div')(({}) => ({
    color: 'white'
}))
export const SelectTeacherGroupWrappper = styled('div')(({}) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}))

