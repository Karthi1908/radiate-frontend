import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Tezos from '../assets/tezos.png'

import '../css/pay.css';

const Pay = ({ senderStreams }) => {

    const selector = useSelector(state => {return state.walletConfig.user});
    const dispatch = useDispatch();

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
                            <table className="table table-light table-borderless">
                                <thead>
                                    <tr className="dash-head">
                                        <th scope="col" className="dash-table-header">STATUS</th>
                                        <th scope="col" className="dash-table-header">TO</th>
                                        <th scope="col" className="dash-table-header">DEPOSIT</th>
                                        <th scope="col" className="dash-table-header">START TIME</th>
                                        <th scope="col" className="dash-table-header">STOP TIME</th>
                                    </tr>
                                </thead>
                                <tbody className="dash-body">
                                    {senderStreams.map((stream) => {
                                        console.log(stream);
                                        return <tr className="dash-row">
                                            {(stream.isActive)?
                                                <td><Link to={"/stream/" + stream.streamId} className="streaming">Streaming</Link></td>:
                                                <td><Link to={"/stream/" + stream.streamId} className="cancelled">Cancelled</Link></td>
                                            }
                                            <td className="receiver"><a target="_blank" href={"https://granadanet.tzkt.io/" +  stream.receiver + "/operations"}>{stream.receiver}</a></td>
                                            <td><img src={Tezos} className="tezos-icon"/>{stream.deposit/1000000}</td>
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