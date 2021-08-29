import React,{ useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { createClient, everything } from 'radiate-finance-sdk';
import { withdraw, cancelStream } from '../actions';
import { useSelector, useDispatch } from 'react-redux';

const StreamDetails = () => {
    let { streamID } = useParams();
    const [stream, setStream] = useState(null);
    const [flow, setFlow] = useState(0);
    const dispatch = useDispatch();
    

    useEffect(() => {
        const create = createClient({
            url: 'wss://hasura-radiateapi.herokuapp.com/v1/graphql'
        });
        (async () => await create.chain.subscription.radiateStream({
        
            where:{'streamId': {_eq: streamID}}

        }).get({...everything}).subscribe(e => {
            setStream(e[0]);
            setFlow(e[0].remainingBalance/1000000);
            setInterval(()=>{
                let timeNow= (new Date()).getTime()/1000;
                let amount_now=parseFloat(((((timeNow-(Date.parse(e[0].startTime))/1000)*e[0].ratePerSecond)-(e[0].deposit-e[0].remainingBalance))/1000000)).toFixed(6);   
                setFlow(`${amount_now} Tez`);},20);
            // console.log(e[0]);
        }))();
    }, []);

    if(stream===null){
        return (
            <div className="container container-content main-section">
                Loading..
                <div class="spinner-border" role="status">
                    
                    <span class="visually-hidden">Loading...</span>
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
                     <div class="row">

                        <div class="col-10">
                            <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">{flow}</h5>
                                        <p class="card-text"></p>
                                    </div>
                            </div>
                        </div>

                        <div class="col">
                            <div class="col">
                                <div class="card" onClick={()=>dispatch(withdraw())}>
                                    <div class="card-body">
                                        <h5 class="card-title">Withdraw</h5>
                                        <p class="card-text"></p>
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">History</h5>
                                        <p class="card-text"></p>
                                    </div>
                                </div>
                            </div>
                            <div class="col" >
                                <div class="card btn" onClick={()=>{dispatch(cancelStream({streamId: stream.streamId}));}}>
                                    <div class="card-body">
                                        <h5 class="card-title">Cancel Stream</h5>
                                        <p class="card-text"></p>
                                    </div>
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