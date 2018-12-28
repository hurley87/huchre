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
          <Col sm={12} md={6} mdOffset={3}>
            <h3>Heads Up Euchre</h3>
            <p>In 2 person euchre each player is dealt 11 cards, 6 down and 5 up. This means there are 11 available tricks each hand and the player with the most tricks at the end of the hand earns points.</p>
            <p>The Joker is the highest card and if it's lead the other player must play their top card. Don't get euchred - points are worth double!</p>
{

            // <p>The strength of your other cards depends on what suit is trump. Choose a suit:</p>
            // <p>
            //   {
            //     ['H', 'S', 'C', 'D'].map((suit, i) => (<Button disabled={this.state.suit === suit} className="suitButton" key={i} onClick={() => this.changeSuit(suit)}>{renderSuit(suit)}</Button>))
            //   }
            // </p>
            // <p>No matter what is trump, the highest card is the Joker.</p>
            // <p>
            //   <img className="play-card" alt="player-card" src="/J/15.png" height="100" />
            // </p>
            // <p>The 2nd highest card is the jack of {renderSuitText(this.state.suit)}.</p>
            // <p>
            //   <img className="play-card" alt="player-card" src={`/${this.state.suit}/11.png`} height="100" />
            // </p>
            // <p>And the 3rd highest card,</p>
            // <p>
            //   <img className="play-card" alt="player-card" src={`/${leftBauerSuit(this.state.suit)}/11.png`} height="100" />
            // </p>
            // <p>The rest of the cards are rank higher from left to right.</p>
            // <p>
            //   {
            //     ['14', '13', '12', '10', '9'].map((value, i) => (<img key={i} className="play-card" alt="player-card" src={`/${this.state.suit}/${value}.png`} height="100" />))
            //   }
            // </p>
            // <p>The player with the hightest card wins the trick.</p>
            // <p>The player with the most tricks wins the hand.</p>

}

            <p><Button className="button" href="/signup">Get Started</Button></p>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Index;
