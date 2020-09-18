import React,{useContext} from 'react';
import {NavLink} from 'react-router-dom'
import { AuthContext } from '../../context/auth-context';
import './MainNavigation.css';

const MainNavigation = () => {

    const {token, logout} = useContext(AuthContext)

            return (
                
                <header className="main-navigation">
                <div className="main-navigation__logo">
                    <h1>ClickEvent</h1>
                </div>
                <div className="main-navigation__items">
                    <ul>
                        {!token && (
                        <li>
                            <NavLink to="/auth">Authenticate</NavLink>    
                        </li>
                        )}

                        <li><NavLink to="/events">Events</NavLink></li>

                        {token && (
                            <>
                        <li>
                            <NavLink to="/bookings">Bookings</NavLink>
                        </li>
                        
                        <li>
                            <button onClick={logout}>Logout</button>
                        </li>
                            </>

                         )}




                    </ul>
                </div>
            </header>
    
            )
    
            }


export default MainNavigation;