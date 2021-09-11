import React,{ useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { _walletConfig } from '../actions';
import { Switch, Route } from 'react-router-dom';
import { createClient, everything } from 'radiate-finance-sdk';
import { TezosToolkit, OpKind } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import {
  NetworkType,
  BeaconEvent,
  defaultEventCallbacks,
  ColorMode
} from "@airgap/beacon-sdk";

import NavBar from './NavBar';
import CreateStream from './CreateStream';
import { Dashboard } from './Dashboard';
import Pay from './Pay';
import StreamDetails from './StreamDetails';

const App = () => {
    const selector = useSelector(state => {return state.walletConfig});
    const dispatch = useDispatch();
    const [Tezos, setTezos] = useState(
        new TezosToolkit("https://granadanet.smartpy.io/")
    );
    const [wallet, setWallet] = useState(null);

    const [senderStreams, setSenderStream] = useState(null);
    const [streams, setStream] = useState(null);

    useEffect(()=>{
        (async () => {
            const wallet_instance = new BeaconWallet({
                name: "Radiate Finance",
                preferredNetwork: NetworkType.GRANADANET,
                colorMode: ColorMode.LIGHT,
                disableDefaultEvents: false, // Disable all events / UI. This also disables the pairing alert.
                eventHandlers: {
                // To keep the pairing alert, we have to add the following default event handlers back
                [BeaconEvent.PAIR_INIT]: {
                    handler: defaultEventCallbacks.PAIR_INIT
                },
                [BeaconEvent.PAIR_SUCCESS]: {
                    handler: data => { return (data.publicKey);}
                }
                }
            });
            Tezos.setWalletProvider(wallet_instance);
            const activeAccount = await wallet_instance.client.getActiveAccount();
            if (activeAccount) {
                const userAddress = await wallet_instance.getPKH();
                const balance = await Tezos.tz.getBalance(userAddress);
                dispatch(_walletConfig({userAddress, balance}));
            }
            setWallet(wallet_instance);
        })();
    },[]);

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
                    // console.log(e)
                });
            }
            
            if(selector.user.userAddress!==""){
                await create.chain.subscription.radiateStream({
                
                    where:{'receiver': {_eq: selector.user.userAddress}}
        
                }).get({...everything}).subscribe(e => {
                    setStream(e);
                    // console.log("find")
                    // console.log(e)
                });
            }

        })();
    }, [selector.user.userAddress]);

    return (
        <>
            <NavBar Tezos={Tezos} setTezos={setTezos} wallet={wallet}/>
            <Switch>
                <Route path="/pay">
                    <Pay senderStreams={senderStreams} setSenderStream={setSenderStream}/>
                </Route>
                <Route path='/createstream'>
                    <CreateStream Tezos={Tezos}/>
                </Route>
                <Route path='/stream/:streamID'>
                    <StreamDetails Tezos={Tezos} wallet={wallet} />
                </Route>
                <Route path='/'>
                    <Dashboard Tezos={Tezos} wallet={wallet} streams={streams}/>
                </Route>
            </Switch>
        </>
    );
}

export default App;
