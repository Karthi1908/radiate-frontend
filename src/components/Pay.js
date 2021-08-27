import React from 'react';
import '../css/dashboard.css';

const Pay = () => {
    if(true){
        return (
            <div className="container container-content table-section">
                <div className="row justify-content-between">
                    <h3>Dashboard</h3>
                    <button type="button" onClick={()=>{}} className="btn btn-primary">Create Stream</button>
                </div>
                <div className="col" align="center">
                    <table className="table table-light table-hover">
                        <thead>
                            <tr>
                            <th scope="col">STATUS</th>
                            <th scope="col">TO</th>
                            <th scope="col">VALUE</th>
                            <th scope="col">PROGRESS</th>
                            <th scope="col">START TIME</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">Streaming</th>
                                <td>tz1000000</td>
                                <td>101.23 XTZ</td>
                                <td><input type="range" className="form-range" id="customRange1"/></td>
                                <td>Fri Aug 27 2021 01:19:33 </td>
                            </tr>
                            <tr>
                                <th scope="row">Streaming</th>
                                <td>tz1000000</td>
                                <td>101.23 XTZ</td>
                                <td><input type="range" className="form-range" id="customRange1"/></td>
                                <td>Fri Aug 27 2021 01:19:33 </td>
                            </tr>
                            <tr>
                                <th scope="row">Streaming</th>
                                <td>tz1000000</td>
                                <td>101.23 XTZ</td>
                                <td><input type="range" className="form-range" id="customRange1"/></td>
                                <td>Fri Aug 27 2021 01:19:33 </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }else{
        return (
            <div className="container container-content main-section">
                <div className="col" align="center">
                    <div className="h5 text">Create stream to get started</div>
                    <button type="button" onClick={()=>{}} className="btn btn-primary">Create Stream</button>
                </div>
            </div>
        );
    }
}

export default Pay;