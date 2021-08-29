import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectWallet, disconnectWallet, createStream} from '../actions';
import DateTimePicker from 'react-datetime-picker';
import '../css/create-stream.css'

import StreamIllustration from '../assets/stream.png'
import CreateStreamIcon from '../assets/CreateStream.png'


const CreateStream = () => {
    const selector = useSelector(state => {return state.walletConfig.user});
    const dispatch = useDispatch();
    const [token, setToken] = useState("");
    const [amount, setAmount] = useState();
    const [receiver, setReceiver] = useState("");
    const [duration, setDuration] = useState("");

    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());

    const handleOnSubmit = (e) => {
        e.preventDefault();
        console.log('step2');
        dispatch(createStream({
            amount : amount*1000000,
            receiver: receiver,
            startTime: (startTime.getTime())/1000,
            token: "Tez",
            stopTime: (endTime.getTime())/1000,
            duration: (endTime.getTime())/1000 - (startTime.getTime())/1000
        }))
        {console.log("step3")}
    }

    // Todo: date picker issue

    return(
        <>
        <div className="container ">
            <div className="row">
                <div className="col-5 col-md-5 col-sm-5 mx-auto">
                    <div className="container-create">
                        <h2 className="create-stream-head text-center">Create Stream<img src={CreateStreamIcon} className="create-stream-icon"/></h2>
                        <form className="form">
                            <div className="form-group">
                                <label className="label">Token</label>
                                <select class="form-select" id="token" onChange={(e)=>{setToken(e.target.value)}}>
                                    <option value="Tez">Tez</option>
                                    <option value="FA12">FA1.2</option>
                                    <option value="FA2">FA2</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="label">Amount</label>
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
