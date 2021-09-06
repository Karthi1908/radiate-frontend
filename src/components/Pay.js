import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import Tezos from "../assets/tezos-icon.png";
import "../css/pay.css";


const getIcon = (i) => {
    if(i===1){
        return <span className="token-tag">FA 1.2</span>
    }else if(i===2){
        return <span className="token-tag">FA 2</span>
    }else{
        return <img src={Tezos} className="tezos-icon" />;
    }
}


const Pay = ({ senderStreams }) => {
    const selector = useSelector((state) => {
        return state.walletConfig.user;
    });
    const dispatch = useDispatch();
    return (
        <div className="container">
            {
                selector.userAddress === "" ? (
                    <div className="container container-content main-section">
                        <div className="col main" align="center">
                            <div className="sign-in-text">
                                Connect Wallet to get started!
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        {senderStreams === null ? (
                            <div className="col container-content" align="center">
                                <div style={{ padding: "10px" }}>
                                    <SkeletonTheme color="#000000" highlightColor="#8D8DDB">
                                        <div
                                            style={{
                                                width: "100px",
                                                marginRight: "auto",
                                            }}
                                        >
                                            <Skeleton />
                                        </div>
                                        <Skeleton count={3} />
                                        <div
                                            style={{
                                                width: "300px",
                                                marginRight: "auto",
                                            }}
                                        >
                                            <Skeleton />
                                        </div>
                                    </SkeletonTheme>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {senderStreams.length === 0 ? (
                                    <div className="container container-content main-section">
                                        <div className="col main" align="center">
                                            <div className="sign-in-text">
                                                Create stream to get started
                                            </div>
                                            <Link
                                                to="/createstream"
                                                className="btn create-stream-btn"
                                            >
                                                Create Stream
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="row container-content">
                                        <div className="table-section">
                                            <div className="row">
                                                <div className="pay-flex">
                                                    <h3 className="pay-dash-head">Streams Created</h3>
                                                    <Link to="/createstream" className="btn top-create-btn">Create Stream</Link>
                                                </div>
                                            </div>
                                            <div className="col" align="center">
                                                <div className="table-responsive">
                                                    <table className="table table-borderless">
                                                        <thead>
                                                            <tr className="dash-head">
                                                                <th scope="col" className="dash-table-header">STATUS</th>
                                                                <th scope="col" className="dash-table-header">TO</th>
                                                                <th scope="col" className="dash-table-header">DEPOSIT</th>
                                                                <th scope="col" className="dash-table-header">START TIME</th>
                                                                <th scope="col" className="dash-table-header">STOP TIME</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="dash-body">
                                                            {senderStreams.map((stream) => {
                                                                console.log(stream);
                                                                return <tr className="dash-row">
                                                                    {(stream.isActive && Date.parse(stream.stopTime) > new Date().getTime()) ?
                                                                        <td><Link to={"/stream/" + stream.streamId} className="streaming">Streaming</Link></td> :
                                                                        <td><Link to={"/stream/" + stream.streamId} className="cancelled">Cancelled</Link></td>
                                                                    }
                                                                    <td className="receiver"><a className="receiver" target="_blank" href={"https://granadanet.tzkt.io/" + stream.receiver + "/operations"}>{stream.receiver}</a></td>
                                                                    <td className="dash-table-body">{getIcon(stream.token)}{stream.deposit / 1000000}</td>
                                                                    <td className="dash-table-body">{new Date(Date.parse(stream.startTime)).toDateString() + " " + new Date(Date.parse(stream.startTime)).toTimeString().split(" GMT")[0]}</td>
                                                                    <td className="dash-table-body">{new Date(Date.parse(stream.stopTime)).toDateString() + " " + new Date(Date.parse(stream.stopTime)).toTimeString().split(" GMT")[0]}</td>
                                                                </tr>
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )
            }
        </div >
    );
};

// sender streams

export default Pay;
