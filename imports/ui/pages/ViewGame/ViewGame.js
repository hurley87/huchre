/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Games from '../../../api/Games/Games';
import Loading from '../../components/Loading/Loading';
import InviteFriend from '../InviteFriend/InviteFriend';
import _ from 'lodash';

const endGame = (gameId) => {
  if (confirm('Are you sure you want to end this game?')) {
    Meteor.call('games.remove', gameId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        console.log('game over');
      }
    });
  }
};

const handleDeal = (game) => {
  const newState = game;
  newState.status = 'order';

  const shuffledDeck = _.shuffle(newState.deck);
  [1, 2, 3, 4, 5].forEach(() => {
    newState.playerOne.hand.push(shuffledDeck.pop());
  });
  [1, 2, 3, 4, 5].forEach(() => {
    newState.playerTwo.hand.push(shuffledDeck.pop());
  });
  [1, 2, 3, 4, 5, 6].forEach(() => {
    newState.playerOne.board.push(shuffledDeck.pop());
  });
  [1, 2, 3, 4, 5, 6].forEach(() => {
    newState.playerTwo.board.push(shuffledDeck.pop());
  });
  newState.currentPlayer === newState.playerOne.id ? newState.currentPlayer = newState.playerTwo.id : newState.currentPlayer = newState.playerOne.id

  newState.deck = shuffledDeck;

  Meteor.call('games.update', newState, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      console.log('cards are dealt');
    }
  });
};

const renderTop = currentState => (currentState ? (
  <Row className="text-center">
    <Col xs={12}>
      {currentState.username}
    </Col>
    <br />
    <br />
    <Col xs={12}>
      hand
    </Col>
    <br />
    <br />
    <Col xs={4}>
      hand 1
    </Col>
    <Col xs={4}>
      hand 2
    </Col>
    <Col xs={4}>
      hand 3
    </Col>
  </Row>
) : <Redirect to="/games" />);

const renderBottom = currentState => (currentState ? (
  <Row className="text-center">
    <Col xs={4}>
      hand 1
    </Col>
    <Col xs={4}>
      hand 2
    </Col>
    <Col xs={4}>
      hand 3
    </Col>
    <br />
    <br />
    <Col xs={12}>
      hand
    </Col>
    <br />
    <br />
    <Col xs={12}>
      {currentState.username}
    </Col>
  </Row>
) : <Redirect to="/games" />);

const renderTable = currentState => (currentState ? (
  <div className="ViewGame">
    <Row>
      <Col xs={12}>
        <h4 className="pull-left">{currentState && currentState.status}</h4>
        <Button onClick={() => endGame(currentState._id)}>End Game</Button>
        <br />
      </Col>
    </Row>
    {
      currentState.playerOne && currentState.playerOne.id !== Meteor.userId() ? renderTop(currentState.playerOne) : renderTop(currentState.playerTwo)
    }
    <br />
    <hr />
    <br />
    <Row>
      <Col xs={12}>
        hey
      </Col>
    </Row>
    <br />
    <hr />
    <br />
    {
      currentState.playerTwo && currentState.playerTwo.id !== Meteor.userId() ? renderBottom(currentState.playerOne) : renderBottom(currentState.playerTwo)
    }
  </div>
) : <Redirect to="/games" />);

const renderDeal = currentState => (currentState ? (
  <Row className="text-center">
    { currentState.currentPlayer === Meteor.userId() ? (
      <Row className="text-center">
        { currentState.currentPlayer === currentState.playerOne.id ? (
            <div>
              {currentState.playerOne.username} needs to press a button to deal
            </div>
          ) : (
            <div>
              {currentState.playerTwo.username} needs to press a button to deal
            </div>
          )
        }
        <Button onClick={() => handleDeal(currentState)}>Deal</Button>
      </Row>
    ) : (
      <Row className="text-center">
        { currentState.currentPlayer === currentState.playerOne.id ? (
            <div>
              waiting on {currentState.playerOne.username} to deal 
            </div>
          ): (
            <div>
              waiting on {currentState.playerTwo.username} to deal
            </div>
          )
        }
      </Row>
    )}
    <Button onClick={() => endGame(currentState._id)}>End Game</Button>
  </Row>
) : <Redirect to="/games" />);

///////////////
// ORDER DISCARD
//////////////


const renderOrderDiscard = currentState => (currentState ? (
  <Row className="text-center">
    <h5>{currentState.playerOne.id === currentState.dealer ? currentState.playerOne.username : currentState.playerTwo.username} is the dealer</h5>
    <h5>{currentState.playerOne.id === currentState.maker ? currentState.playerOne.username : currentState.playerTwo.username} made it {currentState.trump}</h5>
    {
      currentState.currentPlayer === Meteor.userId() ?
        Meteor.userId() === currentState.playerOne.id ? orderDiscardCurrentUi(currentState.playerOne, currentState) : orderDiscardCurrentUi(currentState.playerTwo, currentState)
        :
        Meteor.userId() === currentState.playerOne.id ? orderDiscardOpposingUi(currentState.playerOne, currentState) : orderDiscardOpposingUi(currentState.playerTwo, currentState)
    }
    <br />
    <Button onClick={() => endGame(currentState._id)}>End Game</Button>
  </Row>
) : <Redirect to="/games" />);

const orderDiscardCurrentUi = (player, currentState) => (player ? (
  <div>
    Please discard a card: 
    {
      player.hand.map((card, i) => {
        return (<Button key={i} onClick={() => handleOrderDiscard(currentState, card.suit, card.value)}>{card.suit + card.value}</Button>)
      })
    }
    <Button onClick={() => handleOrderDiscard(currentState, currentState.deck[0].suit, currentState.deck[0].value)}>{currentState.deck[0].suit + currentState.deck[0].value}</Button>
  </div>
) : null)

const orderDiscardOpposingUi = (player, currentState) => (player ? (
  <div>
    waiting on 
  </div>
) : null)

const handleOrderDiscard = (currentState, suit, value) => {
  const newState = currentState;

  if(newState.currentPlayer === newState.playerOne.id) {
    newState.playerOne.hand.push({ suit: currentState.deck[0].suit, value: currentState.deck[0].value });
    const index = _.findIndex(newState.playerOne.hand, { suit, value})
    console.log("INDEX", index);
    newState.playerOne.hand.splice(index, 1);
  } else {
    newState.playerTwo.hand.push({ suit: currentState.deck[0].suit, value: currentState.deck[0].value });
    const index = _.findIndex(newState.playerTwo.hand, { suit, value })
    console.log("INDEX", index);
    newState.playerTwo.hand.splice(index, 1);
  }
  
  newState.dealer === newState.playerOne.id ? newState.currentPlayer = newState.playerTwo.id : newState.currentPlayer = newState.playerOne.id
  newState.trump = newState.deck[0].suit;
  newState.status = 'game';

  Meteor.call('games.update', newState, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      console.log('cards are dealt');
    }
  });
}

///////////////
// ORDER
//////////////


const renderOrder = currentState => (currentState ? (
  <Row className="text-center">
    <h5>{ currentState.playerOne.id === currentState.dealer ? currentState.playerOne.username : currentState.playerTwo.username } is the dealer.</h5>
    {
      currentState.currentPlayer === Meteor.userId() ?
        Meteor.userId() === currentState.playerOne.id ? orderCurrentUi(currentState.playerOne, currentState) : orderCurrentUi(currentState.playerTwo, currentState)
      : 
        Meteor.userId() === currentState.playerOne.id ? orderOpposingUi(currentState.playerOne, currentState) : orderOpposingUi(currentState.playerTwo, currentState)
    }
    <br />
    <Button onClick={() => endGame(currentState._id)}>End Game</Button>
  </Row>
) : <Redirect to="/games" />);

const orderCurrentUi = (player, currentState) => (player ? (
  <div>
    {
      player.hand.map((card, i) => {
        return (<div key={i}> {card.suit + card.value} </div>);
      })
    }
    Do you want to order up the {currentState.deck[0].suit + currentState.deck[0].value} or pass?
    <Button onClick={() => handleOrderPickup(currentState)}>Order</Button>
    <Button onClick={() => handleOrderPass(currentState)}>Pass</Button>
 </div>
) : null)

const orderOpposingUi = (player, currentState) => (player ? (
  <div>
    {currentState.playerTwo.username} has option to order {currentState.deck[0].suit + currentState.deck[0].value}
    <div>your hand:</div>
    {
      currentState.playerOne.hand.map(card => {
        return <div> {card.suit + card.value} </div>
      })
    }
  </div>
) : null)

const handleOrderPickup = (currentState) => {
  const newState = currentState;
  newState.status = 'orderDiscard';
  if (newState.currentPlayer === newState.playerOne.id) {
    newState.maker = newState.playerOne.id;
    newState.currentPlayer = newState.playerTwo.id;
  } else {
    newState.maker = newState.playerTwo.id;
    newState.currentPlayer = newState.playerOne.id;
  }
  newState.trump = newState.deck[0].suit;
  Meteor.call('games.update', newState, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      console.log('cards are dealt');
    }
  });
}

const handleOrderPass = (currentState) => {
  const newState = currentState;
  newState.status = 'make';
  Meteor.call('games.update', newState, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      console.log('cards are dealt');
    }
  });
}

const renderMake = currentState => (currentState ? (
  <Row className="text-center">
    make
    <Button onClick={() => endGame(currentState._id)}>End Game</Button>
  </Row>
) : <Redirect to="/games" />);

const renderStickDealer = currentState => (currentState ? (
  <Row className="text-center">
    stickdealer
  </Row>
) : <Redirect to="/games" />);

const renderAccepted = currentState => (currentState ? (
  <Row className="text-center">
    { currentState.currentPlayer === Meteor.userId() ? (
      <Row className="text-center">
        { currentState.currentPlayer === currentState.playerOne.id ? `${currentState.playerOne.username} needs to press a button to deal` : `${currentState.playerTwo.username} needs to press a button to deal` }
        <Button onClick={() => handleDeal(currentState)}>Deal</Button>
      </Row>
    ) : (
      <Row className="text-center">
        {currentState.currentPlayer === currentState.playerOne.id ? `waiting on ${currentState.playerOne.username} to deal` : `waiting on ${currentState.playerTwo.username} to deal`}
      </Row>
    )}
  </Row>
) : <Redirect to="/games" />);

const ViewGame = ({
  loading, currentState,
}) => (
  !loading ? currentState && currentState.status == 'invite-sent' ? <InviteFriend /> :
    currentState.status === 'invite-accepted' ? renderAccepted(currentState) :
      currentState.status === 'deal' ? renderDeal(currentState) :
        currentState.status === 'order' ? renderOrder(currentState) :
          currentState.status === 'orderDiscard'? renderOrderDiscard(currentState) :
          currentState.status === 'make' ? renderMake(currentState) :
            currentState.status === 'stickdealer' ? renderStickDealer(currentState) :
              renderTable(currentState) : <Loading />
);

ViewGame.defaultProps = {
  currentState: <Redirect to="/games" />,
};

ViewGame.propTypes = {
  loading: PropTypes.bool.isRequired,
  currentState: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const gameId = match.params._id;
  const subscription = Meteor.subscribe('games.view', gameId);
  const currentState = Games.findOne(gameId);

  console.log(currentState);

  return {
    loading: !subscription.ready(),
    currentState,
  };
})(ViewGame);
