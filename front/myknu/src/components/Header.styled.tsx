import {styled} from "@mui/material/styles";

export const HeaderStyled = styled('header')(({}) => ({
    display: 'flex',
    background: 'white',
    height: 60,
}))

export const HeaderNavigation = styled('div')(({}) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginRight: 50,
}))

export const HeaderLogotypeWrapper = styled('div')(({}) => ({
    marginLeft: 50,
    marginRight: 250,
}))