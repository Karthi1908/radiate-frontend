import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createClient, everything } from 'radiate-finance-sdk';
import { Link } from 'react-router-dom';

import '../css/pay.css';

const Pay = () => {

    const selector = useSelector(state => {return state.walletConfig.user});
    const dispatch = useDispatch();

    const [senderStreams, setSenderStream] = useState([]);

    useEffect(async () => {
        const create = createClient({
            url: 'wss://hasura-radiateapi.herokuapp.com/v1/graphql'
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
            <div className="container">
                <div className="table-section">
                    <div className="row">
                        <div className="pay-flex">
                            <h3 className="pay-dash-head">Dashboard</h3>
                            <Link to="/createstream" className="btn top-create-btn">Create Stream</Link>
                        </div>  
                    </div>
                    <div className="col" align="center">
                        <div className="table-responsive">
                            <table className="table table-light table-hover  table-borderless">
                                <thead>
                                    <tr className="dash-head">
                                        <th scope="col" className="dash-table-header">STATUS</th>
                                        <th scope="col" className="dash-table-header">TO</th>
                                        <th scope="col" className="dash-table-header">VALUE</th>
                                        <th scope="col" className="dash-table-header">START TIME</th>
                                        <th scope="col" className="dash-table-header">STOP TIME</th>
                                    </tr>
                                </thead>
                                <tbody className="dash-body">
                                    {senderStreams.map((stream) => {
                                        console.log(stream);
                                        return <tr>
                                            {(stream.isActive)?
                                                <td scope="row">Streaming</td>:
                                                <td scope="row">Cancelled</td>
                                            }
                                            <td className="receiver">{stream.receiver}</td>
                                            <td>{stream.deposit}</td>
                                            <td>{stream.startTime}</td>
                                            <td>{stream.stopTime}</td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }else{
        return (
            <div className="container container-content main-section">
                <div className="col main" align="center">
                    <div className="sign-in-text">Create stream to get started</div>
                    <Link to="/createstream" className="btn create-stream-btn">Create Stream</Link>
                </div>
            </div>
        );
    }
}

// sender streams

export default Pay;