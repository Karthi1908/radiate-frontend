import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectWallet, disconnectWallet, createStream} from '../actions';
import DateTimePicker from 'react-datetime-picker';

import '../css/create-stream.css'

import StreamIllustration from '../assets/stream.png'


const CreateStream = () =>{
    const selector = useSelector(state => {return state.walletConfig.user});
    const dispatch = useDispatch();
    const [token, setToken] = useState("");
    const [amount, setAmount] = useState(0);
    const [receiver, setReceiver] = useState("");
    const [duration, setDuration] = useState("");

    const handleOnSubmit = (e) => {
        e.preventDefault();
        if(token!=="" && amount !== 0 && receiver!=="" && duration!==""){
            // try calling entry point
            if(selector.userAddress!==""){
                dispatch(createStream())
            }
        }
    }

    return(
        <>
        <div className="container ">
            <div className="row">
                <div className="col-4 col-md-4 col-sm-4 mx-auto main">
                    <h2 className="create-stream-head text-center">Create Stream</h2>
                    <form className="form">
                        <div className="form-group">
                            <input type="text" className="form-control" id="token" value={token} onChange={(e)=>{setToken(e.target.value)}}  placeholder="What token do you want to use?"/>
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" id="amount" value={amount} onChange={(e)=>{setAmount(e.target.value)}}   placeholder="How much do you want to stream?"/>
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" id="receiver" value={receiver} onChange={(e)=>{setReceiver(e.target.value)}}   placeholder="Who is the receiver?"/>
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" id="duration" value={duration} onChange={(e)=>{setDuration(e.target.value)}}   placeholder="For how long should the money be streamed"/>
                        </div>
                        <button type="submit" className="btn btn-create mx-auto" onSubmit={handleOnSubmit}>Submit</button>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
}

export default CreateStream
