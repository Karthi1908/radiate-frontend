import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createClient, everything } from 'radiate-finance-sdk';

import '../css/dashboard.css';

const Pay = () => {

    const selector = useSelector(state => {return state.walletConfig.user});
    const dispatch = useDispatch();

    const [senderStreams, setSenderStream] = useState([]);

    useEffect(async () => {
        const create = createClient({
            url: 'ws://hasura-radiateapi.herokuapp.com/v1/graphql'
        });
        
        if(selector.userAddress!==""){
            await create.chain.subscription.radiateStream({
            
                where:{'sender': {_eq: selector.userAddress}}
    
            }).get({...everything}).subscribe(e => {
                setSenderStream(e);
                console.log(e)
            });

        }
    }, [selector.userAddress]);

    if(senderStreams.length > 0){
        return (
            <div className="container container-content table-section">
                <div className="row justify-content-between">
                    <h3>Dashboard</h3>
                    <button type="button" onClick={()=>{}} className="btn btn-primary">Create Stream</button>
                </div>
                <div className="col" align="center">
                    <table className="table table-light table-hover table-responsive">
                        <thead>
                            <tr>
                                <th scope="col">STATUS</th>
                                <th scope="col">TO</th>
                                <th scope="col">VALUE</th>
                                <th scope="col">START TIME</th>
                                <th scope="col">STOP TIME</th>
                            </tr>
                        </thead>
                        <tbody>
                            {senderStreams.map((stream) => {
                                console.log(stream);
                                return <tr>
                                    <th scope="row">Streaming</th>
                                    <td>{stream.receiver}</td>
                                    <td>{stream.deposit}</td>
                                    <td>{stream.startTime}</td>
                                    <td>{stream.stopTime}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }else{
        return (
            <div className="container container-content main-section">
                <div className="col" align="center">
                    <div className="h5 text">Create stream to get started</div>
                    <button type="button" onClick={()=>{}} className="btn btn-primary">Create Stream</button>
                </div>
            </div>
        );
    }
}

// sender streams

export default Pay;