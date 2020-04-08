import React from 'react';
import {NavLink} from 'react-router-dom'

import '../MainNavigation.css';

const mainNavigation = (props) => {
    return (
        <header className="main-navigation">
            <div className="main-navigation__logo">
                <h1>ClickEvent</h1>
            </div>
            <div className="main-navigation__items">
                <ul>
                    <li><NavLink to="/auth">Auth</NavLink></li>
                    <li><NavLink to="/events">Events</NavLink></li>
                    <li><NavLink to="/bookings">Bookings</NavLink></li>
                </ul>
            </div>
        </header>
       
    )
}

export default mainNavigation;