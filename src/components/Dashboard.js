import React from 'react';
import '../css/dashboard.css';

const Dashboard = () => {
    return (
        <div className="container main-section">
            <div className="col" align="center">
                <div className="h5 text">Sign in with your tezos account to view incoming streams</div>
                <button type="button" onClick={{/* popup */}} class="btn btn-primary">Sign in</button>
            </div>
        </div>
    );
}

export default Dashboard;