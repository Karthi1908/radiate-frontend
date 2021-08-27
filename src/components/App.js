import React,{ useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContractData } from '../actions';
import { Switch, Route } from 'react-router-dom';

import NavBar from './NavBar';
import CreateStream from './CreateStream';
import { Dashboard } from './Dashboard';
import Pay from './Pay';

const App = () => {
    const selector = useSelector(state => state);
    const dispatch = useDispatch();

    return (
        <>
            <NavBar/>
            <Switch>
                <Route path="/pay">
                    <Pay/>
                </Route>
                <Route path='/createstream'>
                    <CreateStream/>
                </Route>
                <Route path='/'>
                    <Dashboard/>
                </Route>
            </Switch>
        </>
    );
}

export default App;