import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';

import Trades from './Trades';
import Chart from './Chart';
import Orders from './Orders';
import { Market } from './Market';
import { Topbar } from './Topbar';

export class Layout extends Component {
  render() {
    return (
      <div>
        <Row>
            <Col sm={12}>
                <Topbar/>
            </Col>
        </Row>
        <Row nogutter>
            <Col md={3} lg={3}>
                <Trades/>
            </Col>
            <Col md={6}>
                <Row>
                    <Col lg={12}>
                        <Chart/>
                    </Col>
                    <Col lg={12}>
                        <Orders/>
                    </Col>
                </Row>
            </Col>
            <Col lg={3} md={3}>
                <Market/>
            </Col>
        </Row>
      </div>
    )
  }
}

export default Layout;
