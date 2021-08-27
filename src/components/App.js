import React,{ useEffect } from 'react';
import Header from './Header';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContractData } from '../actions';
import NavBar from './NavBar';
import RadiatePay from './CreateStream';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams,
    BrowserRouter
} from 'react-router-dom';
import CreateStream from './CreateStream';


const App = () => {
    const selector = useSelector(state => state);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(fetchContractData());
    },[dispatch]);

    return (
        <BrowserRouter>
            <NavBar />
            <Switch>
                <Route path="/pay">
                    <CreateStream/>
                </Route>
            </Switch>
        </BrowserRouter>
            
    );
}

export default App;