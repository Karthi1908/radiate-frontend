import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectWallet, disconnectWallet, createStream, createStreamFA2, createStreamFA12} from '../actions';
import DateTimePicker from 'react-datetime-picker';
import '../css/create-stream.css'

import StreamIllustration from '../assets/stream.png'
import CreateStreamIcon from '../assets/tel-stream.png'

import tokenData from './tokens.json'

const CreateStream = () => {
    const selector = useSelector(state => {return state.walletConfig.user});
    const dispatch = useDispatch();
    const [token, setToken] = useState("");
    const [amount, setAmount] = useState("");
    const [receiver, setReceiver] = useState("");
    const [duration, setDuration] = useState("");
    const [contractAddress, setContractAddress] = useState("");
    const [tokenID, setTokenID] = useState("");

    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());

    console.log(tokenData)

    const handleOnSubmit = (e) => {
        e.preventDefault();
        // console.log('step2');
        if(token === "Tez"){
            dispatch(createStream({
                amount : amount*1000000,
                receiver: receiver,
                startTime: (startTime.getTime())/1000,
                token: "Tez",
                stopTime: (endTime.getTime())/1000,
                duration: (endTime.getTime())/1000 - (startTime.getTime())/1000
            }))
        }else if(token === "FA2"){
            dispatch(createStreamFA2({
                amount : amount,
                receiver: receiver,
                startTime: (startTime.getTime())/1000,
                stopTime: (endTime.getTime())/1000,
                duration: (endTime.getTime())/1000 - (startTime.getTime())/1000,
                contractAddress: contractAddress,
                tokenID: tokenID
            }))
        }else {
            dispatch(createStreamFA12({
                amount : amount,
                receiver: receiver,
                startTime: (startTime.getTime())/1000,
                stopTime: (endTime.getTime())/1000,
                duration: (endTime.getTime())/1000 - (startTime.getTime())/1000,
                contractAddress: contractAddress
            }))
        }
        // {console.log("step3")}
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
                                <select className="form-select form-select-lg" id="token" onChange={(e)=>{setToken(e.target.value)}}>
                                    <option value="Tez">Tez</option>
                                    <option value="FA12">FA1.2</option>
                                    <option value="FA2">FA2</option>
                                    {tokenData.map((data) => {
                                        return <option>{data.symbol}</option>
                                    })}
                                </select>
                            </div>
                            {(token==="FA12" || token==="FA2")?(
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
                            ):null}
                            <div className="form-group">
                                <label className="label">{`Amount ${token==="Tez"?"(in Tez)":""}`}</label>
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
                            <button type="submit" className="btn btn-create" onClick={(e)=>{handleOnSubmit(e);console.log("something")}}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default CreateStream
