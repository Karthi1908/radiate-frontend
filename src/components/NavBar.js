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
            <nav class="navbar navbar-expand-lg navbar-light">
                <div className="container">
                    <a class="navbar-brand" href="#">Radiate</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav ml-auto">
                            <li class="nav-item">
                                <Link className="nav-link btn nav-btn" to='/'>Dashboard</Link>
                            </li>
                            <li class="nav-item">
                                <Link className="nav-link btn nav-btn" to='/pay'>Pay</Link>
                            </li>
                            <li class="nav-item">
                                {(selector.userAddress==="")?
                                <button className="nav-link btn nav-btn" onClick={onClick}>Connect Wallet</button>:
                                <button className="nav-link btn nav-btn" onClick={onClick}>Disconnect Wallet</button>}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default NavBar
