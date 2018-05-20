import React, { Component } from 'react';

export class Topbar extends Component {
  constructor(props){
    super(props)

    this.state = {
      data: this.props.data
    }
  }

  componentWillMount(){
    //fetch ticker data first
    fetch('https://api.bitso.com/v3/ticker/?book=btc_mxn', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      })
    })
      .then(response => response.json())
      .then(data => this.setState({ data: data.payload }))
      .catch(err => console.log('Topbar Error: ', err));
    
    //fetch ticker data every 15 sec.
    setTimeout(()=>{
      fetch('https://api.bitso.com/v3/ticker/?book=btc_mxn')
        .then(response => response.json())
        .then(data => this.setState({ data: data.payload }))
    }, 15000)
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
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-2">
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item dropdown px-3">
                  <a className="nav-link dropdown-toggle">
                    <span className="text-success">BTC / MXN</span>
                  </a>
              </li>
              <li className="nav-item">
                <a className="nav-link"><span className="text-muted">Volumen 24 hrs. </span></a>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled">Max</a>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled">Min</a>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled">Variación</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

export default Topbar;
