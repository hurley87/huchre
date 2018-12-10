import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

import './Index.scss';

const Index = () => (
  <div className="Index">
    <h3>Hue</h3>
    <p>A Heads Up Euchre Game</p>
    <div>
      <Button className="button" href="/signup">Get Started</Button>
    </div>
    <br />
    <br />
    <Row className="text-left">
      <Col sm={12} md={6} mdOffset={3}>
        <p>I was taught how to play Euchre at a young age and we would play all the time as a family growing up. It's a game that is typically played with four people but my Mom and I started experimenting with a two player version five years ago.</p>
        <p>Now the online version is built and ready to be played - just in time for Christmas.</p>
        <p>Enjoy, Dave</p>
      </Col>
    </Row>
  </div>
);

export default Index;
