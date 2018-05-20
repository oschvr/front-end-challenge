import React, { Component } from 'react'

export class Navbar extends Component {

  componentWillMount(){
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3">
        <a className="navbar-brand text-light">BITSO</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item text-muted px-3">
                EXCHANGE
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item dropdown px-3">
                  <a className="nav-link dropdown-toggle">
                    1 BTC = 000,000 MXN
                  </a>
              </li>
              <li className="nav-item dropdown px-3">
                <a className="nav-link dropdown-toggle"  id="exchangeDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Wallet
                </a>
                <div className="dropdown-menu rounded-0" aria-labelledby="exchangeDropdown">
                    <a className="dropdown-item" >Resumen</a>
                </div>
              </li>
              <li className="nav-item dropdown px-3">
                <a className="nav-link dropdown-toggle"  id="exchangeDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Exchange
                </a>
                <div className="dropdown-menu rounded-0" aria-labelledby="exchangeDropdown">
                    <a className="dropdown-item" >Trading</a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" >Live Trades</a>
                    <a className="dropdown-item" >Posturas</a>
                </div>
              </li>
              <li className="nav-item px-3">
                <a className="nav-link">Ayuda</a>
              </li>
              <li className="nav-item dropdown px-3">
                <a className="nav-link dropdown-toggle" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Usuario</a>
                <div className="dropdown-menu rounded-0" aria-labelledby="userDropdown">
                    <a className="dropdown-item" >Perfil</a>
                    <a className="dropdown-item" >Salir</a>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

export default Navbar;
