import { combineReducers } from "redux"

const initialWalletState = {
    user: {
        userAddress : "",
        userBalance : 0,
    },
}


const connectWalletReducer = (config = initialWalletState, action) => {
    switch(action.type){
        case "CONNECT_WALLET":
            return {...config,user: action.user, 
                        };
        case "DISCONNECT_WALLET":
            return {...initialWalletState,
                    };
        case "TEZOS_INSTANCE":
            return {...config}
        case "CONNECT_WALLET_ERROR":
            return config;
        default:
            return config;
    }
}

const contractInstanceReducer = (state={hasData:false, contract:null}, action) => {
    switch(action.type){
        case "CREATE_CONTRACT_INSTANCE":
            return action.payload;
        default:
            return state;
    }
}

const createStreamStatus = (state = 0, action) => {
    switch(action.type){
        case "CREATE_STREAM_SUCCESS":
            return 1;
        case "CREATE_STREAM_FAILED":
            return 2;
        case "INITIAL_STATUS":
            return 0;
        default:
            return state;
    }
}

export default combineReducers({walletConfig: connectWalletReducer, contractInstance: contractInstanceReducer, createStreamStatus:createStreamStatus});