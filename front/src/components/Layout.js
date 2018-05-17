import React, { Component } from 'react';
import { Row, Col } from 'react-grid-system';

import Trades from './Trades';
import Chart from './Chart';
import Orders from './Orders';
import { Market } from './Market';
import { Topbar } from './Topbar';
import { Navbar } from './Navbar';

export class Layout extends Component {
  render() {
    return (
      <div>
        <Row>
            <Col sm={12}>
                <Navbar/>
            </Col>
        </Row>
        <Row>
            <Col sm={12}>
                <Topbar/>
            </Col>
        </Row>
        <Row nogutter>
            <Col xs={3}>
                <Trades/>
            </Col>
            <Col xs={6}>
                <Row>
                    <Col sm={12}>
                        <Chart/>
                    </Col>
                    <Col sm={12}>
                        <Orders/>
                    </Col>
                </Row>
            </Col>
            <Col xs={3}>
                <Market/>
            </Col>
        </Row>
      </div>
    )
  }
}

export default Layout;
