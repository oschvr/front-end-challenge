import React, { Component } from 'react';

//API
import axios from 'axios';
//import moment from 'moment';

export class Topbar extends Component {
  constructor(props){
    super(props)

    this.state = {
      data: this.props.data
    }
  }

  componentWillMount(){
    //fetch ticker data first
    axios.get('https://api.bitso.com/v3/ticker/?book=btc_mxn')
      .then((res) => this.setState({
        ticker: res.data.payload
      }, (err) => {
        console.log('Topbar Error: ', err)
      }))
  }

  /*
  {
    "success": true,
    "payload": {
        "book": "btc_mxn",
        "volume": "22.31349615",
        "high": "5750.00",
        "last": "5633.98",
        "low": "5450.00",
        "vwap": "5393.45",
        "ask": "5632.24",
        "bid": "5520.01",
        "created_at": "2016-04-08T17:52:31.000+00:00"
    }
  }
  */

  render() {
    const data = this.state.data;
    console.log('Ticker: ', data);
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-secondary py-0">
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item dropdown px-3">
                  <a className="nav-link dropdown-toggle" id="marketDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span className="text-success">BTC / MXN</span>
                  </a>
                  <div className="dropdown-menu rounded-0" aria-labelledby="marketDropdown">
                    <a className="dropdown-item" >BTC/MXN</a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" >ETH/MXN</a>
                    <a className="dropdown-item" >XRP/MXN</a>
                </div>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item px-3">
                <a className="nav-link"><span className="text-light">Volumen 24 hrs. </span></a>
              </li>
              <li className="nav-item px-3">
                <a className="nav-link disabled"><span className="text-light">Max</span></a>
              </li>
              <li className="nav-item px-3">
                <a className="nav-link disabled"><span className="text-light">Min</span></a>
              </li>
              <li className="nav-item px-3">
                <a className="nav-link disabled"><span className="text-light">Variación</span></a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

export default Topbar;
