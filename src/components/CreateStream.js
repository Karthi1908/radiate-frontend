import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectWallet, disconnectWallet, createStream, createStreamFA2, createStreamFA12} from '../actions';
import DateTimePicker from 'react-datetime-picker';
import '../css/create-stream.css'
import { Link } from 'react-router-dom';

import StreamIllustration from '../assets/stream.png'
import CreateStreamIcon from '../assets/tel-stream.png'
import Tezos from '../assets/tezos-icon.png';
import Close from '../assets/close.png'
import Arrow from '../assets/arrow.png'
import tokenData from './tokens_testnet.json'

const alerts = (i) => {
    if(i===1){
        return (
            <div class="alert alert-success" role="alert">
                Successfully created stream.
            </div>
        );
    }else{
        return (
            <div class="alert alert-warning" role="alert">
                Some error occurred.
            </div>
        );
    }
}

const CreateStream = () => {
    const selector = useSelector(state => {return state.walletConfig.user});
    const statusSelector = useSelector(state=>state.createStreamStatus);
    const dispatch = useDispatch();
    const [amount, setAmount] = useState("");
    const [receiver, setReceiver] = useState("");
    const [duration, setDuration] = useState("");
    const [loader, setLoader] = useState(false);
    const [status, setStatus] = useState(0);

    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());

    const [tokenInfo, setTokenInfo] = useState(tokenData[0])


    useEffect(()=>{
        dispatch({type:"INITIAL_STATUS"});
    },[])

    useEffect(()=>{ 
        if(loader){
            if(statusSelector === 1){
                setStatus(1);
            }else if(statusSelector === 2){
                setStatus(2);
            }
        }
        setLoader(false);
        setTimeout(()=>{setStatus(0);dispatch({type:"INITIAL_STATUS"});}, 3000);
    },[statusSelector]);


    const handleTokenClick = (e) => {
        const key  = e.target.getAttribute('data-key')
        if(key != null){
            setTokenInfo(tokenData[key])
            const modal = document.getElementById('tokenModal')

            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            modal.setAttribute('style', 'display: none');

            // get modal backdrop
            const modalBackdrops = document.getElementsByClassName('modal-backdrop');

            // remove opened modal backdrop
            document.body.removeChild(modalBackdrops[0]);
        }
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        setLoader(true);
        // console.log('step2');
        if(tokenInfo.token_standard === "FA1.2"){
            dispatch(createStreamFA12({
                amount : amount*(10**tokenInfo.decimal),
                receiver: receiver,
                startTime: (startTime.getTime())/1000,
                stopTime: (endTime.getTime())/1000,
                duration: (endTime.getTime())/1000 - (startTime.getTime())/1000,
                contractAddress: tokenInfo.contract_address
            }))
        }else if(tokenInfo.token_standard === "FA2"){
            dispatch(createStreamFA2({
                amount : amount*(10**tokenInfo.decimal),
                receiver: receiver,
                startTime: (startTime.getTime())/1000,
                stopTime: (endTime.getTime())/1000,
                duration: (endTime.getTime())/1000 - (startTime.getTime())/1000,
                contractAddress: tokenInfo.contract_address,
                tokenID: tokenInfo.token_id
            }))
        }else {
            dispatch(createStream({
                amount : amount*(10**tokenInfo.decimal),
                receiver: receiver,
                startTime: (startTime.getTime())/1000,
                token: "Tez",
                stopTime: (endTime.getTime())/1000,
                duration: (endTime.getTime())/1000 - (startTime.getTime())/1000
            }))
        }
        setAmount("");
        setReceiver("");
        setStartTime(new Date());
        setEndTime(new Date());
    }

    return(
        <>
        <div className="container ">
            <div className="row">
                <div className="col-sm-8 col-md-5  mx-auto">
                    <div className="container-create">
                        <h2 className="create-stream-head text-center">Create Stream<img src={CreateStreamIcon} className="create-stream-icon"/></h2>
                        <form className="form">
                            <div className="form-group">
                                <label className="label">Token</label>
                                <div className="row form-first-item" data-bs-toggle="modal" data-bs-target="#tokenModal">
                                    <div className="col-1">
                                        <img src={tokenInfo.uri} className="form-token-img" alt="token-img" />
                                    </div>
                                    <div className="col-10 text-col">
                                        <input type="text" readOnly={true} className="form-control" id="token" value={tokenInfo.symbol} placeholder="Select token"/>
                                    </div>
                                    <div className="col-1 arrow-col">
                                        <img src={Arrow} className="arrow" alt="arrow" />
                                    </div>
                                </div>
                            </div>
                            {/* <div className="form-group">
                                <label className="label">Token</label>
                                <select className="form-select form-select-lg" id="token" onChange={(e)=>{setToken(e.target.value)}}>
                                    <option value="Tez">Tez</option>
                                    <option value="FA12">FA1.2</option>
                                    <option value="FA2">FA2</option>
                                    {tokenData.map((data) => {
                                        return <option title="Not available on testnet">{data.symbol}</option>
                                    })}
                                </select>
                            </div> */}
                            {/* {(token==="FA12" || token==="FA2")?(
                                <div className="form-group">
                                    <label className="label">Contract Address</label>
                                    <input type="text" className="form-control" id="amount" value={contractAddress} onChange={(e)=>{setContractAddress(e.target.value)}}   placeholder="Enter token Address"/>
                                </div>
                            ):null}
                            {(token==="FA2")?(
                                <div className="form-group">
                                    <label className="label">Token ID</label>
                                    <input type="text" className="form-control" id="amount" value={tokenID} onChange={(e)=>{setTokenID(e.target.value)}}   placeholder="Enter token ID"/>
                                </div>
                            ):null} */}
                            <div className="form-group">
                                <label className="label">{`Amount in ${tokenInfo.symbol}`}</label>
                                <input type="text" className="form-control" id="amount" value={amount} onChange={(e)=>{setAmount(e.target.value)}}   placeholder="How much do you want to stream?"/>
                            </div>
                            <div className="form-group">
                                <label className="label">Receiver</label>
                                <input type="text" className="form-control" id="receiver" value={receiver} onChange={(e)=>{setReceiver(e.target.value)}}   placeholder="Who is the receiver?"/>
                            </div>
                            <div className="form-group">
                                <label className="label">Start time</label>
                                <DateTimePicker
                                    className="form-control"
                                    onChange={setStartTime}
                                    value={startTime}
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">End time</label>
                                <DateTimePicker
                                    className="form-control"
                                    onChange={setEndTime}
                                    value={endTime}
                                />
                            </div>
                            {status!==0?alerts(status):null}
                            <button type="submit" className="btn btn-create" onClick={(e)=>{handleOnSubmit(e)}}>{loader?<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>:null} Submit</button>
                            <Link style={{marginLeft:10}} className="btn btn-create" to="/pay">Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="tokenModal" tabindex="-1" aria-labelledby="tokenModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="tokenModalLabel">Select tokens</h5>
                        <a data-bs-dismiss="modal"><img src={Close} className="close" alt="close" /></a>
                    </div>
                    <div class="modal-body">
                        {tokenData.map((data, i) => {
                            return <div className="modal-flex-create" key={i} data-key={i} onClick={handleTokenClick}>
                                <img src={data.uri} className="token-icon" alt="token-icon" id="icon"/>
                                <p className="create-modal-text" id="symbol">{data.symbol}</p>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}



export default CreateStream
