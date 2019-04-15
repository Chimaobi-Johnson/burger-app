import React from 'react';
import classes from './DrawToggle.module.css';

const drawToggle = (props) => (
    <div className={classes.DrawerToggle} onClick={props.clicked}>
        <div></div>
        <div></div>
        <div></div>
    </div>
)

export default drawToggle;