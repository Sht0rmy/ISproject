import {HeaderLogotypeWrapper, HeaderNavigation, HeaderStyled} from "./Header.styled";
import logotype from '../logotype.svg';
import {RouteLinks} from "../modules/navigation/RoutesLinks";
import {NavLink} from "react-router-dom";

export const Header = () => {
    return (
        <HeaderStyled>
            <HeaderLogotypeWrapper>
                <NavLink to='/'>
                    <img src={logotype} alt="logotype"/>
                </NavLink>
            </HeaderLogotypeWrapper>
            <HeaderNavigation>
                <RouteLinks/>
            </HeaderNavigation>
        </HeaderStyled>
    )
}