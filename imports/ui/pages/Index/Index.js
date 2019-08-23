import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

import './Index.scss';

const renderSuit = suit => <img height="20px" src={`https://adsgen.s3.amazonaws.com/${suit}.png`} />;

const renderSuitText = (suit) => {
  switch (suit) {
    case 'H':
      return 'hearts';
      break;
    case 'D':
      return 'diamonds';
      break;
    case 'S':
      return 'spades';
      break;
    case 'C':
      return 'clubs';
      break;
    default:
      return 'clubs';
  }
};

const leftBauerSuit = (suit) => {
  switch (suit) {
    case 'H':
      return 'D';
      break;
    case 'D':
      return 'H';
      break;
    case 'S':
      return 'C';
      break;
    case 'C':
      return 'S';
      break;
    default:
      return 'S';
  }
};

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suit: 'H',
    };
  }
  changeSuit(suit) {
    this.setState({
      suit,
    });
  }
  render() {
    return (
      <div className="Index text-left">
        <Row>
          <Col sm={12} md={6} mdOffset={3}>
            <h3>Heads Up Euchre</h3>
            <p>In 2 person euchre each player is dealt 11 cards, 6 down and 5 up. This means there are 11 available tricks each hand and the player with the most tricks at the end of the hand earns points.</p>
            <p>The Joker is the highest card and if it's lead the other player must play their top card. Don't get euchred - points are worth double!</p>
            <p><Button className="button" href="/signup">Get Started</Button></p>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Index;
