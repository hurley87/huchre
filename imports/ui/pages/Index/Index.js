import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

import './Index.scss';

const renderSuit = suit => <img height="20px" src={`/Suits/${suit}.png`} />;

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
          <Col sm={12} md={8} mdOffset={2}>
            <h3>Heads Up Euchre</h3>
            <p>A 2 person euchre game that's more fun than the 4 person version</p>
            <p><Button className="button" href="/signup">I know the rules - let's get at it</Button></p>
            <br />
            <h3>Rules</h3>
            <p>There are 11 available tricks each hand.</p>
            <p>The player with the most tricks at the end of the hand earns points.</p>
            <p>After the cards are dealt, the player who doesn't deal decides to order or pass.</p>
            <p>If order, the dealer must pick up and the suit of that card is trump.</p>
            <p>If pass, the dealer decides wether to pick it up or pass.</p>
            <p>If the dealer doesn't pickup the other player can decide to make it trump.</p>
            <p>If the other player passes, the dealer is forced to make it trump.</p>
            <p>No matter what is trump, the highest card is the Joker.</p>
            <p>
              <img className="play-card" alt="player-card" src="/J/15.png" height="100" />
            </p>
            <p>The strength of your other cards depends on what suit is trump. Choose a suit:</p>
            <p>
              {
                ['H', 'S', 'C', 'D'].map((suit, i) => (<Button disabled={this.state.suit === suit} className="suitButton" key={i} onClick={() => this.changeSuit(suit)}>{renderSuit(suit)}</Button>))
              }
            </p>
            <p>If <b>{renderSuitText(this.state.suit)}</b> is trump, they rest of the cards are ranks higher from left to right.</p>
            <p>
              <img className="play-card" alt="player-card" src={`/${this.state.suit}/11.png`} height="100" />
              <img className="play-card" alt="player-card" src={`/${leftBauerSuit(this.state.suit)}/11.png`} height="100" />
              {
                ['14', '13', '12', '10', '9'].map((value, i) => (<img key={i} className="play-card" alt="player-card" src={`/${this.state.suit}/${value}.png`} height="100" />))
              }
            </p>
            <p>The player with the hightest card wins the trick.</p>
            <p>The player with the most tricks wins the hand.</p>
            <p><Button className="button" href="/signup">Get Started</Button></p>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Index;
