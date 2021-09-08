import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectWallet, disconnectWallet} from '../actions';
import { Link } from 'react-router-dom';

import '../css/navbar.css'

const NavBar = () =>{
    const selector = useSelector(state => {return state.walletConfig.user});
    const dispatch = useDispatch();

    const onClick = (event) => {
        event.preventDefault();
        if(selector.userAddress===""){
            dispatch(connectWallet());
        }else{
            dispatch(disconnectWallet());
        }
    }

    return(
        <>
            <nav className="navbar navbar-dark navbar-expand-lg">
                <div className="container">
                    <Link className="navbar-brand" to="/">Radiate</Link>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse ml-auto" id="navbarSupportedContent">
                        <ul className="navbar-nav mar-left-nav">
                            <li className="nav-item nav-item-1">
                                <Link className="nav-link btn nav-btn con-btn" to='/'>Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link btn nav-btn con-btn" to='/pay'>Pay</Link>
                            </li>
                            <li className="nav-item">
                                {(selector.userAddress==="")?
                                <div className="btns-div"><button className="nav-link btn nav-btn con-btn" onClick={onClick}>Connect Wallet</button></div>:
                                <div className="btns-div"><button className="nav-link btn nav-btn con-btn" onClick={onClick}>Disconnect Wallet</button></div>}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default NavBar
