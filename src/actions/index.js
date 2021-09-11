import { TezosToolkit, OpKind } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import {
  NetworkType,
  BeaconEvent,
  defaultEventCallbacks,
  ColorMode
} from "@airgap/beacon-sdk";
import config from '../config';


export const connectWallet = (wallet, Tezos) => {
    return async (dispatch, getState)=>{
        try {
            console.log(wallet)
            var payload = {};

            Tezos.setWalletProvider(wallet)

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
            const balance = await Tezos.tz.getBalance(userAddress);

            payload.user = {
                userAddress : userAddress,
                balance : balance.toNumber()
            }
            dispatch(_walletConfig(payload.user));

          } catch (error) {
              console.log(error);
              dispatch({
                  type: "CONNECT_WALLET_ERROR",
              })  
        }
    }
}

export const _walletConfig = (user) => {
    return {
        type:"CONNECT_WALLET",
        user,
    }
}

export const disconnectWallet = (wallet, setTezos) => {
    return async (dispatch, getState) => {

        setTezos(new TezosToolkit("https://granadanet.smartpy.io/"));

        dispatch({
            type:"DISCONNECT_WALLET",
        });

        if(wallet){
            await wallet.client.removeAllAccounts();
            await wallet.client.removeAllPeers();
            await wallet.client.destroy();
        }
      };
}

export const createStream = (formData, Tezos) => {
    return async (dispatch, getState) => {
        try{
            const contract = await Tezos.wallet.at(config.contractAddress);
            console.log("contract instance")
            console.log(contract)
            const op = await contract.methods.createStream(
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
            console.log(op);
            dispatch({type:"CREATE_STREAM_SUCCESS"});
        }catch(e){
            console.log(e);
            dispatch({type:"CREATE_STREAM_FAILED"});
        }
    }
}

export const createStreamFA2 = (formData, Tezos) => {
    return async (dispatch, getState) => {
        try{
            const contract = await Tezos.wallet.at(config.contractAddress);
            const { walletConfig } = getState();
            console.log("contract instance")
            console.log(contract)
            const contract_token = await Tezos.wallet.at(formData.contractAddress);
            const batch = await Tezos.wallet.batch([{
                    kind: OpKind.TRANSACTION,
                    ...contract_token.methods.update_operators([{
                                add_operator:{
                                    owner: walletConfig.user.userAddress,
                                    operator: config.contractAddress, 
                                    token_id: formData.tokenID
                                }
                    }]).toTransferParams()
                },
                {
                    kind: OpKind.TRANSACTION,
                    ...contract.methods.createStream(
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
                    ...contract_token.methods.update_operators([{
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

export const createStreamFA12 = (formData, Tezos) => {
    return async (dispatch, getState) => {
        try{
            const contract = await Tezos.wallet.at(config.contractAddress);
            console.log("contract instance")
            console.log(contract)
            const contract_token = await Tezos.wallet.at(formData.contractAddress);
            const batch = await Tezos.wallet.batch([
                {
                    kind: OpKind.TRANSACTION,
                    ...contract_token.methods.approve(config.contractAddress, (Math.floor(formData.amount/formData.duration)*((Math.floor((formData.stopTime))) - (Math.floor(formData.startTime)))).toString()).toTransferParams() 
                },
                {
                    kind: OpKind.TRANSACTION,
                    ...contract.methods.createStream(
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

export const withdraw = (withdrawParams, Tezos) => {
    return async (dispatch, getState) => {
        try{
            const contract = await Tezos.wallet.at(config.contractAddress);
            const op = await contract.methods.withdraw(
                Math.floor(withdrawParams.amount * (10**withdrawParams.decimal)),
                withdrawParams.streamId
            ).send();
            await op.confirmation();
        }catch(e){
            console.log(e);
        }
    }
}

export const cancelStream = (cancelParams, Tezos) => {
    return async (dispatch, getState) => {
        try{
            const contract = await Tezos.wallet.at(config.contractAddress);
            const op = await contract.methods.cancelStream(
                cancelParams.streamId
            ).send();
            await op.confirmation();
        }catch(e){
            console.log(e);
        }
    }
}

export const AirdropFA12 = (AirdropParams, Tezos) => {
    return async (dispatch, getState) => {
        try{
            const contract = await Tezos.wallet.at(AirdropParams.contractAddress);

            contract.methods.mint(AirdropParams.address, AirdropParams.value).send()

        }catch(e){
            console.log(e);
        }
    }
}

export const AirdropFA2 = (AirdropParams, Tezos) => {
    return async (dispatch, getState) => {
        try{
            const contract = await Tezos.wallet.at(AirdropParams.contractAddress);

            contract.methods.mint_more(AirdropParams.address, AirdropParams.amount, AirdropParams.tokenId).send()
        }catch(e){
            console.log(e);
        }
    }
}