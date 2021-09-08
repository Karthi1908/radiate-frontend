import { TezosToolkit, OpKind } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import {
  NetworkType,
  BeaconEvent,
  defaultEventCallbacks,
  ColorMode
} from "@airgap/beacon-sdk";
import config from '../config';

export const tezosInstance = () => {
    return async (dispatch, getState) => {
        const { walletConfig } = getState();
        if(walletConfig.tezos.tezosToolkit === null){
            const tezosToolkit =  new TezosToolkit("https://granadanet.smartpy.io/")
            dispatch({type:"TEZOS_INSTANCE", tezos:{tezosToolkit:tezosToolkit}});
        }
    }
}

export const contractInstanceAction = () => {
    return async (dispatch, getState) => {
        await dispatch(tezosInstance());
        const { contractInstance, walletConfig } = getState();
        var contract = contractInstance.contract;
        if(!contractInstance.hasData){
            contract = await walletConfig.tezos.tezosToolkit.wallet.at(config.contractAddress);
            dispatch({type:"CREATE_CONTRACT_INSTANCE", payload:{hasData:true, contract}})
        }
    } 
}

export const connectWallet = () => {
    return async (dispatch, getState)=>{
        try {
            await dispatch(tezosInstance());
            const { walletConfig } = getState();

            console.log(walletConfig)
            var tezosToolkit = walletConfig.tezos.tezosToolkit;
            var wallet = walletConfig.beacon.wallet;
            var publicToken = walletConfig.beacon.publicToken;
            var payload = {};

            if(!walletConfig.beacon.beaconConnection){
                wallet = new BeaconWallet({
                    name: "Radiate Finance",
                    preferredNetwork: NetworkType.GRANADANET,
                    colorMode: ColorMode.LIGHT,
                    disableDefaultEvents: false, // Disable all events / UI. This also disables the pairing alert.
                    eventHandlers: {
                    // To keep the pairing alert, we have to add the following default event handlers back
                    [BeaconEvent.PAIR_INIT]: {
                        handler: defaultEventCallbacks.PAIR_INIT
                    },
                    [BeaconEvent.PAIR_SUCCESS]: {
                        handler: data => { return publicToken = (data.publicKey);}
                    }
                    }
                });
            }
            tezosToolkit.setWalletProvider(wallet)

            const activeAccount = await wallet.client.getActiveAccount();
            if(!activeAccount){
                await wallet.requestPermissions({
                network: {
                    type: NetworkType.GRANADANET,
                    rpcUrl: "https://granadanet.smartpy.io/"
                }
                });
            }
            const userAddress = await wallet.getPKH();
            const balance = await tezosToolkit.tz.getBalance(userAddress);
            payload.tezos = {
                tezosToolkit: tezosToolkit
            }
            payload.beacon = {
                wallet: wallet,
                beaconConnection: true,
                publicToken: publicToken
            }
            payload.user = {
                userAddress : userAddress,
                balance : balance.toNumber()
            }
            dispatch(_walletConfig(payload.user, payload.tezos, payload.beacon));

          } catch (error) {
              console.log(error);
              dispatch({
                  type: "CONNECT_WALLET_ERROR",
                  beacon: {
                      beaconConnection: false
                  }
              })  
        }
    }
}

export const _walletConfig = (user, tezos, beacon) => {
    return {
        type:"CONNECT_WALLET",
        tezos,
        user,
        beacon
    }
}

export const disconnectWallet = () => {
    return async (dispatch, getState) => {
        //window.localStorage.clear();
        const { walletConfig } = getState();
        const tezosToolkit =  new TezosToolkit("https://granadanet.smartpy.io/");

        dispatch({
            type:"DISCONNECT_WALLET",
            tezos:{tezosToolkit:tezosToolkit}
        });

        if(walletConfig.beacon.wallet){
            await walletConfig.beacon.wallet.client.removeAllAccounts();
            await walletConfig.beacon.wallet.client.removeAllPeers();
            await walletConfig.beacon.wallet.client.destroy();
        }
      };
}

export const createStream = (formData) => {
    return async (dispatch, getState) => {
        console.log('yes');
        try{
            await dispatch(contractInstanceAction());
            const { contractInstance } = getState();
            console.log("contract instance")
            console.log(contractInstance.contract)
            const op = await contractInstance.contract.methods.createStream(
                Math.floor(formData.amount/formData.duration),
                formData.receiver,
                (Math.floor(formData.startTime)).toString(),
                (Math.floor((formData.stopTime))).toString(),
                "tez",
                [["unit"]]
            ).send({mutez: true, amount:  Math.floor(formData.amount/formData.duration)*((Math.floor((formData.stopTime))) - (Math.floor(formData.startTime)))})
            //
            console.log(op)
            await op.confirmation();
            dispatch({type:"CREATE_STREAM_SUCCESS"});
        }catch(e){
            console.log(e);
            dispatch({type:"CREATE_STREAM_FAILED"});
        }
    }
}

export const createStreamFA2 = (formData) => {
    return async (dispatch, getState) => {
        try{
            await dispatch(contractInstanceAction());
            const { contractInstance } = getState();
            const { walletConfig } = getState();
            console.log("contract instance")
            console.log(contractInstance.contract)
            const contract = await walletConfig.tezos.tezosToolkit.wallet.at(formData.contractAddress);
            const batch = await walletConfig.tezos.tezosToolkit.wallet.batch([{
                    kind: OpKind.TRANSACTION,
                    ...contract.methods.update_operators([{
                                add_operator:{
                                    owner: walletConfig.user.userAddress,
                                    operator: config.contractAddress, 
                                    token_id: formData.tokenID
                                }
                    }]).toTransferParams()
                },
                {
                    kind: OpKind.TRANSACTION,
                    ...contractInstance.contract.methods.createStream(
                        Math.floor(formData.amount/formData.duration),
                        formData.receiver,
                        (Math.floor(formData.startTime)).toString(),
                        (Math.floor((formData.stopTime))).toString(),
                        "FA2",
                        // [[
                            formData.contractAddress,
                            formData.tokenID
                        // ]]
                    ).toTransferParams()
                },
                {
                    kind: OpKind.TRANSACTION,
                    ...contract.methods.update_operators([{
                            remove_operator:{
                                owner: walletConfig.user.userAddress,
                                operator: config.contractAddress, 
                                token_id: formData.tokenID
                            }
                    }]).toTransferParams()
                }
            ]);
            const batchOp = await batch.send();
            console.log('Operation hash:', batchOp);
            await batchOp.confirmation();
            dispatch({type:"CREATE_STREAM_SUCCESS"});
        }catch(e){
            console.log(e);
            dispatch({type:"CREATE_STREAM_FAILED"});
        }
    }
}

export const createStreamFA12 = (formData) => {
    return async (dispatch, getState) => {
        try{
            await dispatch(contractInstanceAction());
            const { contractInstance } = getState();
            const { walletConfig } = getState();
            console.log("contract instance")
            console.log(contractInstance.contract)
            const contract = await walletConfig.tezos.tezosToolkit.wallet.at(formData.contractAddress);
            const batch = await walletConfig.tezos.tezosToolkit.wallet.batch([
                {
                    kind: OpKind.TRANSACTION,
                    ...contract.methods.approve(config.contractAddress, (Math.floor(formData.amount/formData.duration)*((Math.floor((formData.stopTime))) - (Math.floor(formData.startTime)))).toString()).toTransferParams() 
                },
                {
                    kind: OpKind.TRANSACTION,
                    ...contractInstance.contract.methods.createStream(
                        Math.floor(formData.amount/formData.duration),
                        formData.receiver,
                        (Math.floor(formData.startTime)).toString(),
                        (Math.floor((formData.stopTime))).toString(),
                        "FA12",
                        formData.contractAddress
                    ).toTransferParams()   
                }
            ]);
            const batchOp = await batch.send();
            console.log('Operation hash:', batchOp);
            await batchOp.confirmation();
            dispatch({type:"CREATE_STREAM_SUCCESS"});
        }catch(e){
            console.log(e);
            dispatch({type:"CREATE_STREAM_FAILED"});
        }
    }
}

export const withdraw = (withdrawParams) => {
    return async (dispatch, getState) => {
        try{
            await dispatch(contractInstanceAction());
            const { contractInstance } = getState();
            const op = await contractInstance.contract.methods.withdraw(
                Math.floor(withdrawParams.amount * (10**withdrawParams.decimal)),
                withdrawParams.streamId
            ).send();
            await op.confirmation();
        }catch(e){
            console.log(e);
        }
    }
}

export const cancelStream = (cancelParams) => {
    return async (dispatch, getState) => {
        try{
            await dispatch(contractInstanceAction());
            const { contractInstance } = getState();
            const op = await contractInstance.contract.methods.cancelStream(
                cancelParams.streamId
            ).send();
            await op.confirmation();
        }catch(e){
            console.log(e);
        }
    }
}

export const AirdropFA12 = (AirdropParams) => {
    return async (dispatch, getState) => {
        try{
            await dispatch(tezosInstance());
            const {walletConfig } = getState();
            const contract = await walletConfig.tezos.tezosToolkit.wallet.at(AirdropParams.contractAddress);

            contract.methods.mint(AirdropParams.address, AirdropParams.value).send()

        }catch(e){
            console.log(e);
        }
    }
}

export const AirdropFA2 = (AirdropParams) => {
    return async (dispatch, getState) => {
        try{
            console.log(AirdropParams)
            await dispatch(tezosInstance());
            const {walletConfig } = getState();
            const contract = await walletConfig.tezos.tezosToolkit.wallet.at(AirdropParams.contractAddress);

            contract.methods.mint_more(AirdropParams.address, AirdropParams.amount, AirdropParams.tokenId).send()
        }catch(e){
            console.log(e);
        }
    }
}