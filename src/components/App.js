import React,{ useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { tezosInstance, contractInstanceAction, connectWallet } from '../actions';
import { Switch, Route } from 'react-router-dom';
import { createClient, everything } from 'radiate-finance-sdk';

import NavBar from './NavBar';
import CreateStream from './CreateStream';
import { Dashboard } from './Dashboard';
import Pay from './Pay';
import StreamDetails from './StreamDetails';

const App = () => {
    const selector = useSelector(state => {return state.walletConfig});
    const dispatch = useDispatch();

    const [senderStreams, setSenderStream] = useState(null);
    const [streams, setStream] = useState(null);

    // useEffect(()=>{
    //     console.log(selector);
    //     // if(selector.beacon.beaconConnection){
    //         console.log("called");
    //         dispatch(connectWallet());
    //     // }
    // },[])

    useEffect(() => {
        (async () => {
            const create = createClient({
                url: 'wss://hasura-radiateapi.herokuapp.com/v1/graphql'
            });
            
            if(selector.user.userAddress!==""){
                await create.chain.subscription.radiateStream({
                
                    where:{'sender': {_eq: selector.user.userAddress}}
        
                }).get({...everything}).subscribe(e => {
                    setSenderStream(e);
                    console.log(e)
                });
            }
            
            if(selector.user.userAddress!==""){
                await create.chain.subscription.radiateStream({
                
                    where:{'receiver': {_eq: selector.user.userAddress}}
        
                }).get({...everything}).subscribe(e => {
                    setStream(e);
                    console.log("find")
                    console.log(e)
                });
            }

        })();
    }, [selector.user.userAddress]);

    useEffect(()=>{
        dispatch(contractInstanceAction);
    },[dispatch]);

    return (
        <>
            <NavBar/>
            <Switch>
                <Route path="/pay">
                    <Pay senderStreams={senderStreams} setSenderStream={setSenderStream}/>
                </Route>
                <Route path='/createstream'>
                    <CreateStream/>
                </Route>
                <Route path='/stream/:streamID'>
                    <StreamDetails/>
                </Route>
                <Route path='/'>
                    <Dashboard streams={streams}/>
                </Route>
            </Switch>
        </>
    );
}

export default App;
