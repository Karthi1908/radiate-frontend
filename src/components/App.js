import React,{ useEffect } from 'react';
import Header from './Header';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContractData } from '../actions';
import NavBar from './NavBar';

const App = () => {
    const selector = useSelector(state => state);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(fetchContractData());
    },[dispatch]);

    return (
            <NavBar />
            
    );
}

export default App;