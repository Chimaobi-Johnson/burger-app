import React from 'react';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawToggle from '../SideDrawer/DrawToggle/DrawToggle';
import classes from './Toolbar.module.css';

const toolbar = (props) => (
    <header className={classes.Toolbar}>
        <DrawToggle clicked={props.drawerToggleClicked} />
        <div className={classes.Logo}>
         <Logo />
        </div>
        <nav className={classes.DesktopOnly}>
           <NavigationItems isAuthenticated={props.isAuth} />
        </nav>

    </header>
)

export default toolbar;