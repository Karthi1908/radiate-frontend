import React,{ useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { createClient, everything } from 'radiate-finance-sdk';
import { withdraw, cancelStream } from '../actions';
import { useSelector, useDispatch } from 'react-redux';
import '../css/stream-details.css';

const StreamDetails = () => {
    let { streamID } = useParams();
    const [stream, setStream] = useState(null);
    const [flow, setFlow] = useState(0);
    const dispatch = useDispatch();
    const refModel = useRef();
    

    useEffect(() => {
       
        // refModel.current;
        const create = createClient({
            url: 'wss://hasura-radiateapi.herokuapp.com/v1/graphql'
        });
        (async () => await create.chain.subscription.radiateStream({
        
            where:{'streamId': {_eq: streamID}}

        }).get({...everything}).subscribe(e => {
            setStream(e[0]);
            setInterval(()=>{
                let timeNow= (new Date()).getTime()/1000;
                let amount_now=parseFloat(((((timeNow-(Date.parse(e[0].startTime))/1000)*e[0].ratePerSecond)-(e[0].deposit-e[0].remainingBalance))/1000000)).toFixed(6); 
                if(parseFloat(amount_now)>0){
                    setFlow(`${amount_now} Tez`);
                }
                },20);
            // console.log(e[0]);
        }))();
    }, []);

    if(stream===null){
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
            {(stream===undefined)?(
                <div className="container main-section" style={{height:'80vh'}}><span>No such stream exists</span></div>
            ):(
                <div className="container">
            
                     <div className="row align-items-center" style={{height:'80vh'}}>
                        <div className="col-10">
                            <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{flow}</h5>
                                        <p className="card-text"></p>
                                    </div>
                            </div>
                        </div>

                        <div className="col">
                            <div className="col">
                                <div className="card btn" onClick={()=>dispatch(withdraw())}>
                                    <div className="card-body">
                                        <h5 className="card-title">Withdraw</h5>
                                        <p className="card-text"></p>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card btn"  data-bs-toggle="modal" data-bs-target="#historyModal">
                                    <div className="card-body">
                                        <h5 className="card-title">History</h5>
                                        <p className="card-text"></p>
                                    </div>
                                </div>
                            </div>
                            <div className="col" >
                                <div className="card btn" onClick={()=>{dispatch(cancelStream({streamId: stream.streamId}));}}>
                                    <div className="card-body">
                                        <h5 className="card-title">Cancel Stream</h5>
                                        <p className="card-text"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            <div className="modal" id="historyModal" tabIndex="-1"  aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" >
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Modal title</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>Modal body text goes here.</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
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