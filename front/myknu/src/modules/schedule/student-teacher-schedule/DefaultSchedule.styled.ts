import {styled} from "@mui/material/styles";

export const WholeScheduleWrapper = styled('div')(({}) => ({
    marginTop: '50px',
}))

export const ScheduleBlock = styled('div')(({}) => ({
    margin: '15px 15px 15px 0px',
    width: '90%',
    height: '200px',
    borderRadius: '10px',
    background: '#e4e4e4',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 5,
    fontWeight: 'bold',

}))

export const DaysOfWeek = styled('div')(({}) => ({
    display: 'flex',
    background: '#818181',
    borderRadius: '10px',
}))

export const Day = styled('div')(({}) => ({
    width: '100%',
}))

export const DayTitle = styled('div')(({}) => ({
    color: 'white',
    background: '#a7a7a7',
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}))

export const DayBlocksWrapper = styled('div')(({}) => ({
    marginLeft: 20,
}))

export const Discipline = styled('div')(({}) => ({
}))

export const Teacher = styled('div')(({}) => ({
}))

export const MoreDetailsAboutLeacture = styled('div')(({}) => ({
    display: 'flex',
    justifyContent: 'space-between'
}))

export const AuditoryNumber = styled('div')(({}) => ({
}))

export const Type = styled('div')(({}) => ({
}))





