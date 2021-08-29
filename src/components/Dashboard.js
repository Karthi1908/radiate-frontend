import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectWallet } from '../actions';
import '../css/dashboard.css';

import Illus from '../assets/illus.png'

export const Dashboard = (({ streams }) => {
    const selector = useSelector(state => {return state.walletConfig.user});
    const dispatch = useDispatch();

    return (
        
        <div className="container">
            {(selector.userAddress==="")?
                <div className="col main-section container-content" align="center">
                    <div className="img-div"><img src={Illus} className="dash-img" /></div>
                    <div className="dash-main">
                        <p className="sign-in-text">Sign in with your tezos account to view incoming streams</p>
                        <button type="button" onClick={(e)=>{dispatch(connectWallet())}} className="btn sign-in-btn">Connect Wallet</button>
                    </div>
                </div>:
                <div className="row">
                    <div className="col-12 table-section">
                        <div className="table-responsive">
                            <table className="table table-light table-hover table-borderless">
                                <thead>
                                    <tr className="dash-head">
                                        <th scope="col" className="dash-table-header">STREAM ID</th>
                                        <th scope="col" className="dash-table-header">SENDER</th>
                                        <th scope="col" className="dash-table-header">REMAINING BALANCE</th>
                                        <th scope="col" className="dash-table-header">START TIME</th>
                                        <th scope="col" className="dash-table-header">STOP TIME</th>
                                    </tr>
                                </thead>
                                <tbody className="dash-body">
                                        {streams.map((stream, i) => {
                                            return <tr>
                                                <td scope="row" className="dash-table-body">{stream.streamId}</td>
                                                <td className="sender dash-table-body">{stream.sender}</td>
                                                <td className="dash-table-body">{stream.remainingBalance}</td>
                                                <td className="dash-table-body">{stream.startTime}</td>
                                                <td className="dash-table-body">{stream.stopTime}</td>
                                            </tr>
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
});

// receiving streams