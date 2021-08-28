import React,{ useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { createClient, everything } from 'radiate-finance-sdk';
import { useSelector } from 'react-redux';

const StreamDetails = () => {
    let { streamID } = useParams();
    const selector = useSelector((state=>state.walletConfig.user));
    const [stream, setStream] = useState(null);
    

    useEffect(async () => {
        const create = createClient({
            url: 'ws://hasura-radiateapi.herokuapp.com/v1/graphql'
        });
        
        if(selector.userAddress!==""){
            await create.chain.subscription.radiateStream({
            
                where:{'streamId': {_eq: streamID}}
    
            }).get({...everything}).subscribe(e => {
                setStream(e[0]);
                console.log(e[0]);
            });

        }
    }, [selector.userAddress]);

    if(stream===null){
        return (
            <div>
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            {(stream===undefined)?(
                <div>{streamID.toString()}</div>
            ):(
                <div>

                </div>
            )}
        </div>
        );
}

export default StreamDetails;