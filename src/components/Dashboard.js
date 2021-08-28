import React, {useEffect, useState} from 'react';
import '../css/dashboard.css';
import { useSelector, useDispatch } from 'react-redux';
import { connectWallet } from '../actions';

import { createClient, everything } from 'radiate-finance-sdk';
 

export const Dashboard = (() => {
    const selector = useSelector(state => {return state.walletConfig.user});
    const dispatch = useDispatch();

    const [streams, setStream] = useState([]);
    

    useEffect(async () => {
        const create = createClient({
            url: 'ws://hasura-radiateapi.herokuapp.com/v1/graphql'
        });
        
        if(selector.userAddress!==""){
            await create.chain.subscription.radiateStream({
            
                where:{'receiver': {_eq: selector.userAddress}}
    
            }).get({...everything}).subscribe(e => {
                setStream(e);
                console.log(e)
            });

        }
    }, [selector.userAddress]);

    

    return (
        
        <div className="container container-content">
            {(selector.userAddress==="")?
                <div className="col main-section" align="center">
                    <div className="h5 text">Sign in with your tezos account to view incoming streams</div>
                    <button type="button" onClick={(e)=>{dispatch(connectWallet())}} className="btn btn-primary">Sign In</button>
                </div>:
                <div className="row">
                    <div className="col-12">
                        <table className="table table-light table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">SENDER</th>
                                    <th scope="col">REMAINING BALANCE</th>
                                    <th scope="col">STREAM ID</th>
                                    <th scope="col">TOKEN</th>
                                    <th scope="col">START TIME</th>
                                    <th scope="col">STOP TIME</th>
                                </tr>
                            </thead>
                            <tbody>
                                    {streams.map((stream, i) => {
                                        console.log(stream, i);
                                        return <tr>
                                            <td scope="row">{stream.sender}</td>
                                            <td>{stream.remainingBalance}</td>
                                            <td>{stream.streamId}</td>
                                            <td>{stream.token}</td>
                                            <td>{stream.startTime}</td>
                                            <td>{stream.stopTime}</td>
                                        </tr>
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            }
        </div>
    );
});

// receiving streams