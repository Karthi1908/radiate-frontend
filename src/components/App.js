import React,{ useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContractData } from '../actions';
import { Switch, Route } from 'react-router-dom';
import { createClient, everything } from 'radiate-finance-sdk';

import NavBar from './NavBar';
import CreateStream from './CreateStream';
import { Dashboard } from './Dashboard';
import Pay from './Pay';

const App = () => {
    const selector = useSelector(state => state);
    const dispatch = useDispatch();
    const [stream, setStream] = useState({});
    const create = createClient({
        url: 'ws://hasura-radiateapi.herokuapp.com/v1/graphql'
    });

    if(selector.walletConfig.user.userAddress!==""){
        create.chain.subscription.radiateStream({
            
            where:{'receiver': {_eq: selector.walletConfig.user.userAddress}}

        }).get({...everything}).subscribe(
            (e)=>{setStream(e)}
        );
    }

    // useEffect(()=>{
    //     dispatch(fetchContractData());
    // },[dispatch]);

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