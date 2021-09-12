import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { createClient, everything } from 'radiate-finance-sdk';
import { withdraw, cancelStream, connectWallet } from '../actions';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { CircularProgressbar, buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import Tezos from '../assets/tezos-icon.png';
import '../css/stream-details.css';
import Close from '../assets/close.png'
import Back from '../assets/back.png'
import tokenData from './tokens_testnet.json'


const StreamDetails = ({Tezos, wallet}) => {
    let { streamID } = useParams();
    const [stream, setStream] = useState({});
    const [flow, setFlow] = useState(0);
    const dispatch = useDispatch();
    const refModel = useRef();
    const selector = useSelector(state => state.walletConfig.user);
    const [withdrawAmount, setWithdrawAmount] = useState();
    const [percentage, setPercentage] = useState(0);
    const [streamedProgress, setStreamedProgress] = useState(0);
    const [streamData, setStreamData] = useState({});
    
    let multiplier = 1000000;

    useEffect(() => {
        console.log(stream)
        console.log(stream.remainingBalance)
        console.log(stream.deposit)

        const create = createClient({
            url: 'wss://hasura-radiateapi.herokuapp.com/v1/graphql'
        });
        (async () => await create.chain.subscription.radiateStream({

            where: { 'streamId': { _eq: streamID } }

        }).get({ history: { ...everything }, ...everything }).subscribe(e => {
            if(e.length>0){
                setStream(e[0]);
                const tokenInfo = tokenData.filter((data) => data.contract_address === e[0].contractAddress && data.token_id === e[0].tokenId)[0]
                setStreamData(tokenInfo);

                if(e[0].token!==0){
                    const tokenInfo = tokenData.filter((data) => data.contract_address === e[0].contractAddress && data.token_id === e[0].tokenId)[0]
                    multiplier = Math.pow(10,tokenInfo.decimal);
                }

                if (!e[0].isActive) {
                    setFlow(`Cancelled`);
                    setStreamedProgress(100);
                }else if(new Date().getTime() > Date.parse(e[0].stopTime)){
                    let amount_now = parseFloat((((e[0].remainingBalance) / multiplier))).toFixed(6);
                    setFlow(`${amount_now}`);
                    setStreamedProgress(100);
                    setPercentage(100);
                }else{
                    setInterval(() => {
                        let timeNow = (new Date()).getTime() / 1000;
                        let amount_now = parseFloat(((((timeNow - (Date.parse(e[0].startTime)) / 1000) * e[0].ratePerSecond) - (e[0].deposit - e[0].remainingBalance)) / multiplier)).toFixed(6);
                        if (parseFloat(amount_now) > 0 && e[0].isActive && timeNow*1000 < Date.parse(e[0].stopTime)) {
                            setFlow(`${amount_now}`);
                            setStreamedProgress(100*(((timeNow - (Date.parse(e[0].startTime)) / 1000) * e[0].ratePerSecond) / (((Date.parse(e[0].stopTime)) / 1000 - (Date.parse(e[0].startTime)) / 1000) * e[0].ratePerSecond)))
                        }
                        
                        const total = e[0].remainingBalance/multiplier;
                        setPercentage((amount_now/total)*100);
                    }, 500);
                }
            }
        }))();
    }, []);

    const handleOnWithdraw = async () => {
        if (selector.userAddress === "") {
            try {
                await dispatch(connectWallet(wallet, Tezos));
            } catch (e) {
                console.log(e);
            }
        }
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        handleOnWithdraw();
        const tokenInfo = tokenData.filter((data) => data.contract_address === stream.contractAddress && data.token_id === stream.tokenId)[0]
        if (withdrawAmount !== 0) {
            dispatch(withdraw({ amount: withdrawAmount, streamId: stream.streamId, decimal: tokenInfo.decimal }, Tezos));
            setWithdrawAmount(0);
        }
    }
    
    if (JSON.stringify(stream) === JSON.stringify({})) {
        return (
            <div className="container container-content main-section">
                Loading..
                <div className="spinner-border" role="status">

                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const isoTimeToDisplayTime = (isoTime) => {
        return (new Date(Date.parse(isoTime)).toDateString() + " " + new Date(Date.parse(isoTime)).toTimeString().split(" GMT")[0])
    }

    return (
        <div className="container container-content-details">
            {(stream === undefined) ? (
                <div className="container main-section" style={{ height: '80vh' }}><span>No such stream exists</span></div>
            ) : (
                <div className="container">
                    <div className="row">
                        {(stream.sender == selector.userAddress)?
                        <Link to="/pay" ><img src={Back} className="back" alt="back" /></Link>:
                        <Link to="/" ><img src={Back} className="back" alt="back" /></Link>
                        }
                    </div>
                    <div className="row align-items-center" >
                        <div className="col-10">
                            <div className="">
                                <div className="card-body">
                                    <div className="row justify-content-center">
                                        <div className="circle-progress-bar" style={{width:400, height:400}}>
                                            <CircularProgressbarWithChildren
                                                value={percentage}
                                                // text={`${flow}`}
                                                styles={buildStyles({
                                                    rotation: 0.25,
                                                    strokeLinecap: 'round',
                                                    textSize: '10px',
                                                    pathTransitionDuration: 1,
                                                    pathColor: `#48cae4`,
                                                    textColor: '#000000',
                                                    trailColor: '#C3C5FD',
                                                    backgroundColor: '#3e98c7',
                                                })}
                                            >
                                                <img
                                                style={{ width: 60, marginTop: -5 }}
                                                src={(() => {
                                                    let tokenInfo = tokenData.filter((data) => data.contract_address === stream.contractAddress && data.token_id === stream.tokenId)[0]
                                                    if(!tokenInfo){tokenInfo = {}}
                                                    return tokenInfo.uri
                                                })()}
                                                alt=""
                                                />
                                                <div style={{ fontSize: 30, marginTop: 5 }}>
                                                    {flow}
                                                </div>
                                            </CircularProgressbarWithChildren>
                                        </div>
                                    </div>
                                    <p className="card-text text-center card-status">{(stream.isActive && Date.parse(stream.stopTime) > new Date().getTime()) ? "Streaming" : "Ended"}</p>
                                </div>
                            </div>
                            {/* <div className="detail-stream-amount">
                                <div className="row justify-content-md-center" style={{margin:"0 200px"}}>
                                    <div className="col detail-main-div mx-auto">
                                        <div className="col">
                                            <span className="">Streamed: <br/></span>
                                            <div class="progress" style={{width:200, height:10, transform:""}}>
                                                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{width:`${streamedProgress}%`,}} ></div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <span className="">Withdrawn: <br/></span>
                                            <div class="progress" style={{width:200, height:10}}>
                                                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{width:`${100*((stream.deposit - stream.remainingBalance)/stream.deposit)}%`,}} ></div>
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                            </div> */}
                            <div className="detail-time-flex">
                                <div className="detail-start-time">
                                    {(() => {
                                        if((Date.now() > (new Date(stream.stopTime)).getTime())){
                                            return <div className=""><span className="span-time">Streamed: </span>{(((stream.ratePerSecond * (((new Date(stream.stopTime)).getTime()) - (new Date(stream.startTime)).getTime()))/1000)/(10**streamData.decimal)).toFixed(6)} {streamData.symbol}</div>
                                        }else if(Date.now() > (new Date(stream.startTime)).getTime()){
                                            return <div className=""><span className="span-time">Streamed: </span>{(stream.ratePerSecond * (((Date.now() - (new Date(stream.startTime)).getTime()))/1000)/(10**streamData.decimal)).toFixed(6)} {streamData.symbol}</div>
                                        }else{
                                            return <div className=""><span className="span-time">Streamed: </span>0 {streamData.symbol}</div>
                                        }
                                    })()}
                                </div>
                                <div className="detail-stop-time">
                                    <span className="span-time">Withdrawn: </span>{(stream.deposit)?
                                    (stream.deposit - stream.remainingBalance)/10**streamData.decimal
                                    : 0} {streamData.symbol}
                                </div>
                            </div>
                            <div className="detail-time-flex">
                                <div className="detail-stop-time">
                                    {(() => {
                                        if(stream.startTime || stream.stopTime){
                                            if(Date.now() < (new Date(stream.startTime)).getTime()){
                                                return <div className=""><span className="span-time">Will start on: </span> {isoTimeToDisplayTime(stream.startTime)}</div>
                                            }
                                            else if(Date.now() < (new Date(stream.stopTime)).getTime()){
                                                if(stream.isActive){
                                                    return <div className=""><span className="span-time">Will End on: </span> {isoTimeToDisplayTime(stream.stopTime)}</div>
                                                }else{
                                                    return <div className="">Cancelled</div>
                                                }
                                            }else{
                                                return <div className=""><span className="span-time">Ended on: </span> {isoTimeToDisplayTime(stream.stopTime)}</div>
                                            }
                                        }else{
                                            <></>
                                        }
                                    })()}
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            {(selector.userAddress === stream.receiver)?
                                <div className="col">
                                    <div className="card btn card-custom" data-bs-toggle="modal" data-bs-target="#withdrawModal" onClick={handleOnWithdraw}>
                                        <div className="card-body">
                                            <h5 className="card-title">Withdraw</h5>
                                            <p className="card-text"></p>
                                        </div>
                                    </div>
                                </div>:<></>
                            }
                            <div className="col">
                                <div className="card btn card-custom" data-bs-toggle="modal" data-bs-target="#historyModal">
                                    <div className="card-body">
                                        <h5 className="card-title">History</h5>
                                        <p className="card-text"></p>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card btn card-custom" onClick={() => {dispatch(cancelStream({ streamId: stream.streamId }, Tezos)); }}>
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
                                    <a data-bs-dismiss="modal"><img src={Close} className="close" alt="close" /></a>
                                </div>
                                <div className="modal-body">
                                    <div className="table-responsive">
                                        <table className="table table-borderless">
                                            <thead>
                                                <tr className="dash-head">
                                                    <th scope="col" className="dash-table-header">STATUS</th>
                                                    <th scope="col" className="dash-table-header">Amount</th>
                                                    <th scope="col" className="dash-table-header">On</th>
                                                </tr>
                                            </thead>
                                            <tbody className="dash-body">
                                                {(stream.history)? stream.history.map((element, idx) => {
                                                    const tokenInfo = tokenData.filter((data) => data.contract_address === stream.contractAddress && data.token_id === stream.tokenId)[0]
                                                    return <tr className="dash-row" key={idx}>
                                                        <td className="dash-table-body">Withdraw</td>
                                                        <td className="dash-table-body"><img src={tokenInfo.uri} className="tezos-icon" />{element.amount / multiplier}</td>
                                                        <td className="dash-table-body">@{new Date(Date.parse(element.timestamp)).toDateString() + " " + new Date(Date.parse(element.timestamp)).toTimeString().split(" GMT")[0]}</td>
                                                    </tr>
                                                }):<></>}
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
                                    <a data-bs-dismiss="modal"><img src={Close} className="close" alt="close" /></a>
                                </div>
                                <div className="modal-body">
                                    <form className="form">
                                        <div className="form-group">
                                            <label className="label">{`Amount in ${streamData.symbol}`}</label>
                                            <input type="text" className="form-control" id="amount" value={withdrawAmount} onChange={(e) => { setWithdrawAmount(e.target.value) }} placeholder="Enter amount to withdraw" />
                                        </div>
                                        <button type="submit" className="btn btn-withdraw" onClick={(e) => { handleOnSubmit(e) }}>Submit</button>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StreamDetails;