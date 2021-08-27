import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectWallet, disconnectWallet} from '../actions';

import '../css/create-stream.css'

import StreamIllustration from '../assets/stream.png'


const CreateStream = () =>{
    const selector = useSelector(state => {return state.walletConfig.user});
    const dispatch = useDispatch();

    

    return(
        <>
        <div className="container ">
            <div className="row">
                <div className="col-4 col-md-4 col-sm-4 mx-auto main">
                    
                    <h2 className="create-stream-head text-center">Create Stream</h2>
                    <form className="form">
                        <div className="form-group">
                            <input type="text" className="form-control" id="token"  placeholder="What token do you want to use?"/>
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" id="amount"  placeholder="How much do you want to stream?"/>
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" id="receiver"  placeholder="Who is the receiver?"/>
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" id="duration"  placeholder="For how long should the money be streamed"/>
                        </div>
                        <button type="submit" className="btn btn-create mx-auto">Submit</button>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
}

export default CreateStream
