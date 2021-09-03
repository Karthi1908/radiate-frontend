import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { createClient, everything } from 'radiate-finance-sdk';
import { withdraw, cancelStream, connectWallet } from '../actions';
import { useSelector, useDispatch } from 'react-redux';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import Tezos from '../assets/tezos.png';
import '../css/stream-details.css';


const StreamDetails = () => {
    let { streamID } = useParams();
    const [stream, setStream] = useState(null);
    const [flow, setFlow] = useState(0);
    const dispatch = useDispatch();
    const refModel = useRef();
    const selector = useSelector(state => state.walletConfig.user);
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [percentage, setPercentage] = useState(0);


    useEffect(() => {

        // refModel.current;
        const create = createClient({
            url: 'wss://hasura-radiateapi.herokuapp.com/v1/graphql'
        });
        (async () => await create.chain.subscription.radiateStream({

            where: { 'streamId': { _eq: streamID } }

        }).get({ history: { ...everything }, ...everything }).subscribe(e => {
            if(e.length>0){
                setStream(e[0]);
                if (new Date().getTime() > Date.parse(e[0].stopTime) || !e[0].isActive) {
                    let amount_now = parseFloat((((e[0].remainingBalance) / 1000000))).toFixed(6);
                    console.log("Stream ended");
                    setFlow(`${amount_now} tez`);
                }
                setInterval(() => {
                    let timeNow = (new Date()).getTime() / 1000;
                    let amount_now = parseFloat(((((timeNow - (Date.parse(e[0].startTime)) / 1000) * e[0].ratePerSecond) - (e[0].deposit - e[0].remainingBalance)) / 1000000)).toFixed(6);
                    if (parseFloat(amount_now) > 0 && e[0].isActive && timeNow*1000 < Date.parse(e[0].stopTime)) {
                        setFlow(`${amount_now} tez`);
                    }
                    const total = e[0].remainingBalance/1000000;
                    setPercentage((amount_now/total)*100);
                }, 500);
            }
            // console.log(e[0]);
        }))();
    }, []);

    const handleOnWithdraw = async () => {
        if (selector.userAddress === "") {
            try {
                await dispatch(connectWallet());
                // dispatch(withdraw({amount:12, streamId:2}));
            } catch (e) {
                console.log(e);
            }
        }
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        handleOnWithdraw();
        if (withdrawAmount !== 0) {
            dispatch(withdraw({ amount: withdrawAmount, streamId: stream.streamId, decimal: 6 }));
            setWithdrawAmount(0);
        }
    }

    if (stream === null) {
        return (
            <div className="container container-content main-section">
                Loading..
                <div className="spinner-border" role="status">

                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container container-content">
            {(stream === undefined) ? (
                <div className="container main-section" style={{ height: '80vh' }}><span>No such stream exists</span></div>
            ) : (
                <div className="container">
                    <div className="row align-items-center" style={{ height: '80vh' }}>
                        <div className="col-10">
                            <div className="card main-card">
                                <div className="card-body ">
                                    <div className="row justify-content-center">
                                        <div className="circle-progress-bar" style={{width:450, height:450}}>
                                            <CircularProgressbar
                                                value={percentage}
                                                text={`${flow}`}
                                                styles={buildStyles({
                                                    rotation: 0.25,
                                                    strokeLinecap: 'round',
                                                    textSize: '12px',
                                                    pathTransitionDuration: 1,
                                                    pathColor: `rgba(61, 178, 255)`,
                                                    textColor: '#000000',
                                                    trailColor: '#d6d6d6',
                                                    backgroundColor: '#3e98c7',
                                                })}
                                            />
                                        </div>
                                    </div>
                                    {/* <h1 className="card-title title"> {flow}</h1> */}
                                    <p className="card-text text-center card-status">{(stream.isActive && Date.parse(stream.stopTime) > new Date().getTime()) ? "Streaming" : "Ended"}</p>
                                </div>
                            </div>
                            <div className="detail-time-flex">
                                {/* <div className="Streamed">
                                    <span className="span-time">Streamed: </span>{(percentage)}
                                </div> */}
                                <div className="detail-start-time">
                                    <span className="span-time">Started on: </span>{(new Date(Date.parse(stream.startTime)).toDateString()) + " " + new Date(Date.parse(stream.startTime)).toTimeString().split(" GMT")[0]}
                                </div>
                                <div className="detail-stop-time">
                                    <span className="span-time">Will End on: </span>{new Date(Date.parse(stream.stopTime)).toDateString() + " " + new Date(Date.parse(stream.stopTime)).toTimeString().split(" GMT")[0]}
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="col">
                                <div className="card btn" data-bs-toggle="modal" data-bs-target="#withdrawModal" onClick={handleOnWithdraw}>
                                    <div className="card-body">
                                        <h5 className="card-title">Withdraw</h5>
                                        <p className="card-text"></p>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card btn" data-bs-toggle="modal" data-bs-target="#historyModal">
                                    <div className="card-body">
                                        <h5 className="card-title">History</h5>
                                        <p className="card-text"></p>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card btn" onClick={() => {dispatch(cancelStream({ streamId: stream.streamId })); }}>
                                    <div className="card-body">
                                        <h5 className="card-title">Cancel Stream</h5>
                                        <p className="card-text"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal" id="historyModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">History</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="table-responsive">
                                        <table className="table table-light table-borderless">
                                            <thead>
                                                <tr className="dash-head">
                                                    <th scope="col" className="dash-table-header">STATUS</th>
                                                    <th scope="col" className="dash-table-header">Amount</th>
                                                    <th scope="col" className="dash-table-header">On</th>
                                                </tr>
                                            </thead>
                                            <tbody className="dash-body">
                                                {stream.history.map((element, idx) => {
                                                    return <tr className="dash-row" key={idx}>
                                                        <td>Withdraw</td>
                                                        <td><img src={Tezos} className="tezos-icon" />{element.amount / 1000000}</td>
                                                        <td className="dash-table-body">@{new Date(Date.parse(element.timestamp)).toDateString() + " " + new Date(Date.parse(element.timestamp)).toTimeString().split(" GMT")[0]}</td>
                                                    </tr>
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal" id="withdrawModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Withdraw</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">

                                    <form className="form">
                                        <div className="form-group">
                                            <input type="text" className="form-control" id="amount" value={withdrawAmount} onChange={(e) => { setWithdrawAmount(e.target.value) }} placeholder="Enter amount to withdraw" />
                                        </div>
                                        <button type="submit" className="btn btn-withdraw" onClick={(e) => { handleOnSubmit(e) }}>Submit</button>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: '11'}}>
                    <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-header">
                        <strong className="me-auto">Invalid</strong>
                        <small>0 mins ago</small>
                        <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div className="toast-body">
                        Account is not the receiver.
                        </div>
                    </div>
                </div> */}
                </div>
            )}
        </div>
    );
}

export default StreamDetails;