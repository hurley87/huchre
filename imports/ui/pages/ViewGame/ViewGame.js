/* eslint-disable prefer-destructuring */
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
import './ViewGame.scss';

const renderCard = (suit, value) => <img className="play-card" alt="player-card" src={`/${suit}/${value}.png`} height="100" />;

const renderSuit = suit => <img height="20px" src={`/Suits/${suit}.png`} />;

const renderCover = () => <img className="play-card" src="/Covers/blue.png" height="100" />;

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

const updateGame = (newState) => {
  Meteor.call('games.update', newState, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      console.log('game state has been updated');
    }
  });
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
  [1, 2].forEach(() => {
    newState.playerOne.first.push(shuffledDeck.pop());
  });
  [1, 2].forEach(() => {
    newState.playerOne.second.push(shuffledDeck.pop());
  });
  [1, 2].forEach(() => {
    newState.playerOne.third.push(shuffledDeck.pop());
  });
  [1, 2].forEach(() => {
    newState.playerTwo.first.push(shuffledDeck.pop());
  });
  [1, 2].forEach(() => {
    newState.playerTwo.second.push(shuffledDeck.pop());
  });
  [1, 2].forEach(() => {
    newState.playerTwo.third.push(shuffledDeck.pop());
  });
  newState.currentPlayer === newState.playerOne.id ? newState.currentPlayer = newState.playerTwo.id : newState.currentPlayer = newState.playerOne.id;
  newState.deck = shuffledDeck;
  updateGame(newState);
};

const renderTable = currentState => (currentState && currentState.playerOne ? (
  <Row className="text-center">
    {
      currentState.handCount === 0 ? null :
        currentState.handCount % 2 === 0 ? (
          <p>{renderCard(currentState.deck[currentState.deck.length - 2].suit, currentState.deck[currentState.deck.length - 2].value)} lead {renderCard(currentState.deck[currentState.deck.length - 1].suit, currentState.deck[currentState.deck.length - 1].value)} played</p>
        ) : (
          <p>{renderCard(currentState.deck[currentState.deck.length - 1].suit, currentState.deck[currentState.deck.length - 1].value)} lead</p>
        )
    }
  </Row>
) : <Redirect to="/games" />);

const convertCard = (trump, card) => {
  if (card.value === 15) {
    return {
      suit: trump,
      value: 18,
      view: true,
      hover: false,
    };
  } else if (card.value === 11 && card.suit === trump) {
    return {
      suit: trump,
      value: 17,
      view: true,
      hover: false,
    };
  } else if (trump === 'S' && card.value === 11 && card.suit === 'C') {
    return {
      suit: trump,
      value: 16,
      view: true,
      hover: false,
    };
  } else if (trump === 'C' && card.value === 11 && card.suit === 'S') {
    return {
      suit: trump,
      value: 16,
      view: true,
      hover: false,
    };
  } else if (trump === 'H' && card.value === 11 && card.suit === 'D') {
    return {
      suit: trump,
      value: 16,
      view: true,
      hover: false,
    };
  } else if (trump === 'D' && card.value === 11 && card.suit === 'H') {
    return {
      suit: trump,
      value: 16,
      view: true,
      hover: false,
    };
  }
  return card;
};

const hasSuitToFollow = (player, suitToFollow, trump) => {
  const cardsToCheck = [];
  const playableCards = [];
  for (let i = 0; i < player.hand.length; i++) cardsToCheck.push(player.hand[i]);
  player.first.length > 0 ? cardsToCheck.push(player.first[0]) : null;
  player.second.length > 0 ? cardsToCheck.push(player.second[0]) : null;
  player.third.length > 0 ? cardsToCheck.push(player.third[0]) : null;

  for (let i = 0; i < cardsToCheck.length; i++) {
    if (convertCard(trump, cardsToCheck[i]).suit === suitToFollow) {
      playableCards.push(cardsToCheck[i]);
    }
  }
  return playableCards;
};

const followsuit = (player, currentState, card) => {
  const cardPlayed = currentState.deck[currentState.deck.length - 1];
  const handCard = convertCard(currentState.trump, card);
  const cardLead = convertCard(currentState.trump, cardPlayed);
  const suitToFollow = cardLead.suit;
  const playableCards = hasSuitToFollow(player, suitToFollow, currentState.trump);
  let bestCard = { suit: 'D', value: 1 };

  for (let i = 0; i < playableCards.length; i++) {
    const playCard = convertCard(currentState.trump, playableCards[i]);
    if (playCard.value > bestCard.value) {
      bestCard = playCard;
    }
  }

  if (currentState.currentPlayer !== player.id || currentState.status !== 'game') {
    return true;
  } 
    if (currentState.handCount % 2 === 0) {
      return false;
    } else if (playableCards.length > 0) {
      if (cardPlayed.suit === 'J') {
        if (handCard.suit === bestCard.suit && handCard.value === bestCard.value) {
          return false;
        }
        return true;
      }
      if (handCard.suit === cardLead.suit) {
        return false;
      }
      return true;
    }
    return false;
  
};

const handlePlayCard = (currentState, player, card, hand) => {
  const newState = currentState;

  // evaluate move
  // TODO: figure out left bauer and Joker
  if (currentState.handCount % 2 !== 0) {
    if (currentState.currentPlayer === currentState.playerOne.id) {
      const playerTwoLeadCard = convertCard(currentState.trump, currentState.deck[currentState.deck.length - 1]);
      const playerOneReponseCard = convertCard(currentState.trump, card);

      if (playerTwoLeadCard.suit === currentState.trump) {
        // player two and player one are both trump
        if (playerOneReponseCard.suit === currentState.trump) {
          if (playerTwoLeadCard.value < playerOneReponseCard.value) {
            currentState.playerOne.trick += 1;
            currentState.currentPlayer = currentState.playerOne.id;
          } else {
            currentState.playerTwo.trick += 1;
            currentState.currentPlayer = currentState.playerTwo.id;
          }
        } else {
          // player two is trump and player one is not trump
          currentState.playerTwo.trick += 1;
          currentState.currentPlayer = currentState.playerTwo.id;
        }
      } else {
        // player not not trump and player one is trump
        if (playerOneReponseCard.suit === currentState.trump) {
          currentState.playerOne.trick += 1;
          currentState.currentPlayer = currentState.playerOne.id;
        } else {
          // player two and player one are not trump
          if (playerTwoLeadCard.suit !== playerOneReponseCard.suit) {
            currentState.playerTwo.trick += 1;
            currentState.currentPlayer = currentState.playerTwo.id;
          } else if (playerTwoLeadCard.value < playerOneReponseCard.value) {
            currentState.playerOne.trick += 1;
            currentState.currentPlayer = currentState.playerOne.id;
          } else {
            currentState.playerTwo.trick += 1;
            currentState.currentPlayer = currentState.playerTwo.id;
          }
        }
      }
    } else {
      const playerOneLeadCard = convertCard(currentState.trump, currentState.deck[currentState.deck.length - 1]);
      const playerTwoReponseCard = convertCard(currentState.trump, card);

      if (playerOneLeadCard.suit === currentState.trump) {
        // player two and player one are both trump
        if (playerTwoReponseCard.suit === currentState.trump) {
          if (playerOneLeadCard.value < playerTwoReponseCard.value) {
            currentState.playerTwo.trick += 1;
            currentState.currentPlayer = currentState.playerTwo.id;
          } else {
            currentState.playerOne.trick += 1;
            currentState.currentPlayer = currentState.playerOne.id;
          }
        } else {
          // player one is trump and player two is not trump
          currentState.playerOne.trick += 1;
          currentState.currentPlayer = currentState.playerOne.id;
        }
      } else {
        // player one not trump and player two is trump
        if (playerTwoReponseCard.suit === currentState.trump) {
          currentState.playerTwo.trick += 1;
          currentState.currentPlayer = currentState.playerTwo.id;
        } else {
          // player two and player one are not trump
          if (playerOneLeadCard.suit !== playerTwoReponseCard.suit) {
            currentState.playerOne.trick += 1;
            currentState.currentPlayer = currentState.playerOne.id;
          } else if (playerOneLeadCard.value < playerTwoReponseCard.value) {
            currentState.playerTwo.trick += 1;
            currentState.currentPlayer = currentState.playerTwo.id;
          } else {
            currentState.playerOne.trick += 1;
            currentState.currentPlayer = currentState.playerOne.id;
          }
        }
      }
    }
  } else {
    console.log('dont eval');
    newState.currentPlayer === newState.playerOne.id ? newState.currentPlayer = newState.playerTwo.id : newState.currentPlayer = newState.playerOne.id;
  }

  // remove card from hand
  switch (hand) {
    case 'first':
      player.id === newState.playerOne.id ? newState.playerOne.first.splice(_.findIndex(newState.playerOne.first, { suit: card.suit, value: card.value }), 1) : newState.playerTwo.first.splice(_.findIndex(newState.playerTwo.first, { suit: card.suit, value: card.value }), 1);
      newState.deck.push(card);
      break;
    case 'second':
      player.id === newState.playerOne.id ? newState.playerOne.second.splice(_.findIndex(newState.playerOne.second, { suit: card.suit, value: card.value }), 1) : newState.playerTwo.second.splice(_.findIndex(newState.playerTwo.second, { suit: card.suit, value: card.value }), 1);
      newState.deck.push(card);
      break;
    case 'third':
      player.id === newState.playerOne.id ? newState.playerOne.third.splice(_.findIndex(newState.playerOne.third, { suit: card.suit, value: card.value }), 1) : newState.playerTwo.third.splice(_.findIndex(newState.playerTwo.third, { suit: card.suit, value: card.value }), 1);
      newState.deck.push(card);
      break;
    case 'hand':
      player.id === newState.playerOne.id ? newState.playerOne.hand.splice(_.findIndex(newState.playerOne.hand, { suit: card.suit, value: card.value }), 1) : newState.playerTwo.hand.splice(_.findIndex(newState.playerTwo.hand, { suit: card.suit, value: card.value }), 1);
      newState.deck.push(card);
      break;
    default:
      console.log('we have lost');
      break;
  }

  if (newState.handCount === 21) {
    newState.status = 'over';
  } else {
    newState.status = 'game';
    newState.handCount = currentState.handCount + 1;
  }

  updateGame(newState);
};

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
        <Button className='button' onClick={() => handleDeal(currentState)}>Deal</Button>
      </Row>
    ) : (
      <Row className="text-center">
        { currentState.currentPlayer === currentState.playerOne.id ? (
          <div>
              waiting on {currentState.playerOne.username} to deal
          </div>
          ) : (
            <div>
              waiting on {currentState.playerTwo.username} to deal
            </div>
          )
        }
      </Row>
    )}
  </Row>
) : <Redirect to="/games" />);

// /////////////
// ORDER DISCARD
// ////////////


const renderOrderDiscard = currentState => (currentState ? (
  <Row className="text-center">
    {
      currentState.currentPlayer === Meteor.userId() ?
        Meteor.userId() === currentState.playerOne.id ? orderDiscardCurrentUi(currentState.playerOne, currentState) : orderDiscardCurrentUi(currentState.playerTwo, currentState)
        :
        Meteor.userId() === currentState.playerOne.id ? orderDiscardOpposingUi(currentState.playerOne, currentState) : orderDiscardOpposingUi(currentState.playerTwo, currentState)
    }
  </Row>
) : <Redirect to="/games" />);

const orderDiscardCurrentUi = (player, currentState) => (player ? (
  <div>
    Discard:
    {
      player.hand.map((card, i) => (<Button key={i} onClick={() => handleOrderDiscard(currentState, card.suit, card.value)}>{renderCard(card.suit, card.value)}</Button>))
    }
    <Button onClick={() => handleOrderDiscard(currentState, currentState.deck[0].suit, currentState.deck[0].value)}>{renderCard(currentState.deck[0].suit, currentState.deck[0].value)}</Button>
  </div>
) : null);

const orderDiscardOpposingUi = (player, currentState) => (player ? (
  <div>
    You just ordered the {renderCard(currentState.deck[0].suit, currentState.deck[0].value)}
  </div>
) : null);

const handleOrderDiscard = (currentState, suit, value) => {
  const newState = currentState;

  if (newState.currentPlayer === newState.playerOne.id) {
    newState.playerOne.hand.push({ suit: currentState.deck[0].suit, value: currentState.deck[0].value });
    const index = _.findIndex(newState.playerOne.hand, { suit, value });
    newState.playerOne.hand.splice(index, 1);
  } else {
    newState.playerTwo.hand.push({ suit: currentState.deck[0].suit, value: currentState.deck[0].value });
    const index = _.findIndex(newState.playerTwo.hand, { suit, value });
    newState.playerTwo.hand.splice(index, 1);
  }

  newState.dealer === newState.playerOne.id ? newState.currentPlayer = newState.playerTwo.id : newState.currentPlayer = newState.playerOne.id;
  if (newState.deck[0].suit !== 'J') newState.trump = newState.deck[0].suit;
  newState.status = 'game';
  updateGame(newState);
};

// /////////////
// ORDER
// ////////////


const renderOrder = currentState => (currentState ? (
  <Row className="text-center">
    {
      currentState.currentPlayer === Meteor.userId() ?
        Meteor.userId() === currentState.playerOne.id ? orderCurrentUi(currentState.playerOne, currentState) : orderCurrentUi(currentState.playerTwo, currentState)
      :
        Meteor.userId() === currentState.playerOne.id ? orderOpposingUi(currentState.playerOne, currentState) : orderOpposingUi(currentState.playerTwo, currentState)
    }
  </Row>
) : <Redirect to="/games" />);

const orderCurrentUi = (player, currentState) => (player ? (
  <div>
    Do you want to order up the {renderCard(currentState.deck[0].suit, currentState.deck[0].value)} or pass?
    <Button className='button' onClick={() => handleOrderPickup(currentState)}>Order</Button>
    <Button className='button' onClick={() => handleOrderPass(currentState)}>Pass</Button>
  </div>
) : null);

const orderOpposingUi = (player, currentState) => (player ? (
  <div>
    {currentState.playerTwo.username} has option to order {renderCard(currentState.deck[0].suit, currentState.deck[0].value)}
  </div>
) : null);

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
  updateGame(newState);
};

const handleOrderPass = (currentState) => {
  const newState = currentState;
  newState.status = 'pickup';
  newState.currentPlayer === newState.playerOne.id ? newState.currentPlayer = newState.playerTwo.id : newState.currentPlayer = newState.playerOne.id;
  updateGame(newState);
};

const renderPickup = currentState => (currentState ? (
  <Row className="text-center">
    {
      currentState.currentPlayer === Meteor.userId() ?
        Meteor.userId() === currentState.playerOne.id ? pickupCurrentUi(currentState.playerOne, currentState) : pickupCurrentUi(currentState.playerTwo, currentState)
        :
        Meteor.userId() === currentState.playerOne.id ? pickupOpposingUi(currentState.playerOne, currentState) : pickupOpposingUi(currentState.playerTwo, currentState)
    }
  </Row>
) : <Redirect to="/games" />);

const pickupCurrentUi = (player, currentState) => (player ? (
  <div>
    Do you want to pick up the {renderCard(currentState.deck[0].suit, currentState.deck[0].value)} or pass?
    <Button className='button' onClick={() => handlePickup(currentState, 'make')}>Make</Button>
    <Button className='button' onClick={() => handlePickup(currentState, 'pass')}>Pass</Button>
  </div>
) : null);

const pickupOpposingUi = (player, currentState) => (player ? (
  <div>
    { currentState.playerOne.id === player.id ? currentState.playerOne.username : currentState.playerTwo.username } is deciding wether or not to pick up {renderCard(currentState.deck[0].suit, currentState.deck[0].value)}
  </div>
) : null);

const handlePickup = (currentState, move) => {
  const newState = currentState;
  if (move === 'pass') {
    newState.status = 'make';
    newState.currentPlayer === newState.playerOne.id ? newState.currentPlayer = newState.playerTwo.id : newState.currentPlayer = newState.playerOne.id;
  } else {
    newState.status = 'pickupDiscard';
    newState.currentPlayer === newState.playerOne.id ? newState.maker = newState.playerOne.id : newState.maker = newState.playerTwo.id;
    newState.trump = currentState.deck[0].suit;
  }
  updateGame(newState);
};


const renderPickupDiscard = currentState => (currentState ? (
  <Row className="text-center">
    {
      currentState.currentPlayer === Meteor.userId() ?
        Meteor.userId() === currentState.playerOne.id ? pickupDiscardCurrentUi(currentState.playerOne, currentState) : pickupDiscardCurrentUi(currentState.playerTwo, currentState)
        :
        Meteor.userId() === currentState.playerOne.id ? pickupDiscardOpposingUi(currentState.playerOne, currentState) : pickupDiscardOpposingUi(currentState.playerTwo, currentState)
    }
    <br />
  </Row>
) : <Redirect to="/games" />);


const handleMakeTrump = (currentState, trump) => {
  const newState = currentState;
  newState.trump = trump;
  updateGame(newState);
};

const pickupDiscardCurrentUi = (player, currentState) => (player ? (
  <div>
    {
      currentState.trump === 'J' ? (
        <div>
          <h5>Make it trump!</h5>
          {
            ['H', 'S', 'C', 'D'].map((suit, i) => (<Button key={i} onClick={() => handleMakeTrump(currentState, suit)}>{renderSuit(suit)}</Button>))
          }
        </div>
      ) : (
        <div>
          Discard:
          {
              player.hand.map((card, i) => (<Button key={i} onClick={() => handleOrderDiscard(currentState, card.suit, card.value)}>{renderCard(card.suit, card.value)}</Button>))
          }
          <Button onClick={() => handleOrderDiscard(currentState, currentState.deck[0].suit, currentState.deck[0].value)}>{renderCard(currentState.deck[0].suit, currentState.deck[0].value)}</Button>
        </div>
      )
    }
  </div>
) : null);

const pickupDiscardOpposingUi = (player, currentState) => (player ? (
  <div>
    <h5>Waiting on {player.id === currentState.playerOne.id ? currentState.playerOne.username : currentState.playerTwo.username} to discard</h5>
  </div>
) : null);

const renderMake = currentState => (currentState ? (
  <Row className="text-center">
    {
      currentState.currentPlayer === Meteor.userId() ?
        Meteor.userId() === currentState.playerOne.id ? makeCurrentUi(currentState.playerOne, currentState) : makeCurrentUi(currentState.playerTwo, currentState)
        :
        Meteor.userId() === currentState.playerOne.id ? makeOpposingUi(currentState.playerOne, currentState) : makeOpposingUi(currentState.playerTwo, currentState)
    }
  </Row>
) : <Redirect to="/games" />);

const makeCurrentUi = (player, currentState) => (player ? (
  <div>
    <h5>What suit do you want to make it?</h5>
    {
      ['H', 'S', 'C', 'D'].map((suit, i) => (<Button key={i} onClick={() => handleMakeSuit(currentState, suit)}>{renderSuit(suit)}</Button>))
    }
    <Button onClick={() => handleMakeSuit(currentState, 'pass')}>pass</Button>
  </div>
) : null);

const makeOpposingUi = (player, currentState) => (player ? (
  <div>
    Waiting on opposing player to make it.
  </div>
) : null);

const handleMakeSuit = (currentState, suit) => {
  const newState = currentState;

  if (suit === 'pass') {
    newState.status = 'stickdealer';
    if (newState.currentPlayer === newState.playerOne.id) {
      newState.currentPlayer = newState.playerTwo.id;
    } else {
      newState.currentPlayer = newState.playerOne.id;
    }
  } else {
    newState.status = 'game';
    newState.trump = suit;
    if (newState.currentPlayer === newState.playerOne.id) {
      newState.maker = newState.playerOne.id;
    } else {
      newState.maker = newState.playerTwo.id;
    }
    if (newState.dealer === newState.playerOne.id) {
      newState.currentPlayer = newState.playerTwo.id;
    } else {
      newState.currentPlayer = newState.playerOne.id;
    }
  }
  updateGame(newState);
};

const renderStickDealer = currentState => (currentState ? (
  <Row className="text-center">
    {
      currentState.currentPlayer === Meteor.userId() ?
        Meteor.userId() === currentState.playerOne.id ? stdCurrentUi(currentState.playerOne, currentState) : stdCurrentUi(currentState.playerTwo, currentState)
        :
        Meteor.userId() === currentState.playerOne.id ? stdOpposingUi(currentState.playerOne, currentState) : stdOpposingUi(currentState.playerTwo, currentState)
    }
  </Row>
) : <Redirect to="/games" />);

const stdCurrentUi = (player, currentState) => (player ? (
  <div>
    <h5>What suit do you want to make it?</h5>
    {
      ['H', 'S', 'C', 'D'].map((suit, i) => (<Button key={i} onClick={() => handleStdMake(currentState, suit)}>{renderSuit(suit)}</Button>))
    }
  </div>
) : null);

const stdOpposingUi = (player, currentState) => (player ? (
  <div>
    Waiting on opposing player to make it.
  </div>
) : null);

const handleStdMake = (currentState, suit) => {
  const newState = currentState;
  newState.status = 'game';
  newState.trump = suit;
  if (newState.currentPlayer === newState.playerOne.id) {
    newState.maker = newState.playerOne.id;
  } else {
    newState.maker = newState.playerTwo.id;
  }
  if (newState.dealer === newState.playerOne.id) {
    newState.currentPlayer = newState.playerTwo.id;
  } else {
    newState.currentPlayer = newState.playerOne.id;
  }
  updateGame(newState);
};

const renderAccepted = currentState => (currentState ? (
  <Row className="text-center">
    { currentState.currentPlayer === Meteor.userId() ? (
      <Row className="text-center">
        <h5>{currentState.currentPlayer === currentState.playerOne.id ? `${currentState.playerOne.username} needs to press a button to deal` : `${currentState.playerTwo.username} needs to press a button to deal`}</h5>
        <Button className="button" onClick={() => handleDeal(currentState)}>Deal</Button>
      </Row>
    ) : (
      <Row className="text-center">
          <h5>{currentState.currentPlayer === currentState.playerOne.id ? `waiting on ${currentState.playerOne.username} to deal` : `waiting on ${currentState.playerTwo.username} to deal`}</h5>
      </Row>
    )}
  </Row>
) : <Redirect to="/games" />);

const renderPlayerOneOver = (currentState) => {
  if (currentState.playerOne.trick > currentState.playerTwo.trick) {
    if (currentState.maker === currentState.playerOne.id) {
      const points = currentState.playerOne.trick - currentState.playerTwo.trick;
      return (
        <h5>You win and earn {points} {points === 1 ? 'point' : 'points'}</h5>
      );
    }
    const points = (currentState.playerOne.trick - currentState.playerTwo.trick) * 2;
    return (
      <h5>You euchred {currentState.playerTwo.username} and earned {points} {points === 1 ? 'point' : 'points'}</h5>
    );
  }
  if (currentState.maker === currentState.playerTwo.id) {
    const points = currentState.playerTwo.trick - currentState.playerOne.trick;
    return (
      <h5>{currentState.playerTwo.username} wins and earns {points} {points === 1 ? 'point' : 'points'}</h5>
    );
  }
  const points = (currentState.playerTwo.trick - currentState.playerOne.trick) * 2;
  return (
    <h5>{currentState.playerTwo.username} euchred you and earned {points} {points === 1 ? 'point' : 'points'}</h5>
  );
};

const renderPlayerTwoOver = (currentState) => {
  if (currentState.playerTwo.trick > currentState.playerOne.trick) {
    if (currentState.maker === currentState.playerTwo.id) {
      const points = currentState.playerTwo.trick - currentState.playerOne.trick;
      return (
        <h5>You win and earned {points} {points === 1 ? 'point' : 'points'}</h5>
      );
    }
    const points = (currentState.playerTwo.trick - currentState.playerOne.trick) * 2;
    return (
      <h5>You euchred {currentState.playerOne.username} and earned {points} {points === 1 ? 'point' : 'points'}</h5>
    );
  }
  if (currentState.maker === currentState.playerTwo.id) {
    const points = (currentState.playerOne.trick - currentState.playerTwo.trick) * 2;
    return (
      <h5>{currentState.playerOne.username} wins and earns {points} {points === 1 ? 'point' : 'points'}</h5>
    );
  }
  const points = (currentState.playerOne.trick - currentState.playerTwo.trick) * 2;
  return (
    <h5>{currentState.playerOne.username} euchred you and earned {points} {points === 1 ? 'point' : 'points'}</h5>
  );
};

const nextHand = (currentState) => {
  const newState = currentState;
  if (newState.playerOne.trick > newState.playerTwo.trick) {
    const points = newState.playerOne.trick - newState.playerTwo.trick;
    if (newState.playerOne.id === newState.maker) {
      newState.playerOne.score += points;
    } else {
      newState.playerOne.score += 2 * points;
    }
  } else {
    const points = newState.playerTwo.trick - newState.playerOne.trick;
    if (newState.playerTwo.id === newState.maker) {
      newState.playerTwo.score += points;
    } else {
      newState.playerTwo.score += 2 * points;
    }
  }

  // keep track of each hand
  const doc = {
    dealer: currentState.dealer,
    deck: currentState.deck,
    handCount: currentState.handCount,
    maker: currentState.maker,
    playerOneScore: currentState.playerOne.trick,
    playerOneId: currentState.playerOne.id,
    playerTwoScore: currentState.playerTwo.trick,
    playerTwoId: currentState.playerTwo.id,
    trump: currentState.trump,
  };
  Meteor.call('hands.insert', doc, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      console.log('hand inserted');
    }
  });

  if (newState.dealer === newState.playerOne.id) {
    newState.currentPlayer = newState.playerTwo.id;
    newState.dealer = newState.playerTwo.id;
  } else {
    newState.currentPlayer = newState.playerOne.id;
    newState.dealer = newState.playerOne.id;
  }

  newState.maker = '';
  newState.playerOne.trick = 0;
  newState.playerTwo.trick = 0;
  newState.trump = '';
  newState.handCount = 0;
  // TODO: add view when game is over! insert or update player profiles at that point
  newState.status = 'deal';
  if (newState.playerOne.score >= newState.limit || newState.playerTwo.score >= newState.limit) {
    newState.status = 'final';
  } else {
    newState.status = 'deal';
  }
  updateGame(newState);
};

const renderOver = currentState => (currentState && currentState.playerOne ? (
  <Row className="text-center">
    {
      Meteor.userId() === currentState.playerOne.id ? renderPlayerOneOver(currentState) : renderPlayerTwoOver(currentState)
    }
    <Button className='button' onClick={() => nextHand(currentState)}>Next Hand</Button>
  </Row>
) : <Redirect to="/games" />);

const endFinal = (currentState) => {
  const newState = currentState;

  const p1 = {
    username: newState.playerOne.username,
    score: newState.playerOne.score,
    playerId: newState.playerOne.id,
    winner: (newState.playerOne.score > newState.playerTwo.score),
  };
  const p2 = {
    username: newState.playerTwo.username,
    score: newState.playerTwo.score,
    playerId: newState.playerTwo.id,
    winner: (newState.playerTwo.score > newState.playerOne.score),
  };
  Meteor.call('profiles.insert', p1, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      console.log('player1 inserted');
      Meteor.call('profiles.insert', p2, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          console.log('player2 inserted');
          Meteor.call('games.remove', currentState._id, (error) => {
            if (error) {
              Bert.alert(error.reason, 'danger');
            } else {
              console.log('game over');
            }
          });
        }
      });
    }
  });
  console.log(newState);
};

const renderFinal = currentState => (currentState && currentState.playerOne ? (
  <Row className="text-center">
    <h5>Game is over!</h5>
    <Button className="button" onClick={() => endFinal(currentState)}>End Game</Button>
  </Row>
) : <Redirect to="/games" />);

const renderTableView = (currentState) => {
  const status = currentState.status;
  let component = <Loading />;
  switch (status) {
    case 'invite-sent':
      component = (<InviteFriend />);
      break;
    case 'invite-accepted':
      component = renderAccepted(currentState);
      break;
    case 'deal':
      component = renderDeal(currentState);
      break;
    case 'order':
      component = renderOrder(currentState);
      break;
    case 'orderDiscard':
      component = renderOrderDiscard(currentState);
      break;
    case 'pickup':
      component = renderPickup(currentState);
      break;
    case 'pickupDiscard':
      component = renderPickupDiscard(currentState);
      break;
    case 'make':
      component = renderMake(currentState);
      break;
    case 'stickdealer':
      component = renderStickDealer(currentState);
      break;
    case 'game':
      component = renderTable(currentState);
      break;
    case 'over':
      component = renderOver(currentState);
      break;
    default:
      component = renderFinal(currentState);
  }
  return component;
};

const dealer = () => (<span className="badge">D</span>);
const yourTurn = (currentState) => (<span className="badge">Your { currentState.handCount % 2 === 0 ? 'lead' : 'turn'}</span>);

const renderTop = (player, currentState) => (
  <Row>
    <Col xs={12}>
      {player.hand.map(() => renderCover())}
    </Col>
    <Col style={{position: 'relative', height: '100px'}} className="text-left" xs={3}>
      <div style={{position: 'absolute', bottom: '0px'}}>
        <h3 style={{ marginBottom: '0px' }}>{player.username} {currentState.dealer === player.id ? dealer() : null} {currentState.maker === player.id ? (<span style={{ position: 'relative', bottom: '1px' }}>{renderSuit(currentState.trump)}</span>) : null}</h3>
        <h1 style={{ marginBottom: '0px' }}>{player.score} <small>{player.trick}</small></h1>
      </div>
    </Col>
    <Col xs={2}>
      {(player.first.length === 1 || player.first.length === 2) && currentState.status === 'game' ? <span>{renderCard(player.first[0].suit, player.first[0].value)}</span> : null}
      {player.first.length === 2 ? renderCover() : null}
    </Col>
    <Col xs={2}>
      {(player.second.length === 1 || player.second.length === 2) && currentState.status === 'game' ? <span>{renderCard(player.second[0].suit, player.second[0].value)}</span> : null}
      {player.second.length === 2 ? renderCover() : null}
    </Col>
    <Col xs={2}>
      {(player.third.length === 1 || player.third.length === 2) && currentState.status === 'game' ? <span>{renderCard(player.third[0].suit, player.third[0].value)}</span> : null}
      {player.third.length === 2 ? renderCover() : null}
    </Col>
  </Row>
);

const renderBottom = (player, currentState) => (
  <Row>
    <Col className="text-left" xs={3}>
      <h1 style={{ marginTop: '0px' }}>{player.score} <small>{player.trick} {currentState.currentPlayer === player.id && currentState.status === 'game' ? yourTurn(currentState) : null}</small></h1>
      <h3 style={{ marginBottom: '25px' }}>{player.username} {currentState.dealer === player.id ? dealer() : null} {currentState.maker === player.id ? (<span style={{ position: 'relative', bottom: '1px' }}>{renderSuit(currentState.trump)}</span>) : null}</h3>
    </Col>
    <Col xs={2}>
      {(player.first.length === 1 || player.first.length === 2) && currentState.status === 'game' ? <Button disabled={followsuit(player, currentState, player.first[0])} onClick={() => handlePlayCard(currentState, player, player.first[0], 'first')}>{renderCard(player.first[0].suit, player.first[0].value)}</Button> : null}
      {player.first.length === 2 ? renderCover() : null}
    </Col>
    <Col xs={2}>
      {(player.second.length === 1 || player.second.length === 2) && currentState.status === 'game' ? <Button disabled={followsuit(player, currentState, player.second[0])} onClick={() => handlePlayCard(currentState, player, player.second[0], 'second')}>{renderCard(player.second[0].suit, player.second[0].value)}</Button> : null}
      {player.second.length === 2 ? renderCover() : null}
    </Col>
    <Col xs={2}>
      {(player.third.length === 1 || player.third.length === 2) && currentState.status === 'game' ? <Button disabled={followsuit(player, currentState, player.third[0])} onClick={() => handlePlayCard(currentState, player, player.third[0], 'third')}>{renderCard(player.third[0].suit, player.third[0].value)}</Button> : null}
      {player.third.length === 2 ? renderCover() : null}
    </Col>
    <Col xs={12}>
      {player.hand.map((card, i) => (<Button key={i} disabled={followsuit(player, currentState, card)} onClick={() => handlePlayCard(currentState, player, card, 'hand')}>{renderCard(card.suit, card.value)}</Button>))}
    </Col>
  </Row>
);

const renderTableLayout = (currentState) => {
  let currentPlayer = currentState.playerOne;
  let opposingPlayer = currentState.playerTwo;
  if (Meteor.userId() === currentState.playerTwo.id) {
    currentPlayer = currentState.playerTwo;
    opposingPlayer = currentState.playerOne;
  }
  const states = ['order', 'orderDiscard', 'game', 'pickup', 'pickupDiscard', 'make', 'stickdealer'];
  return (
    <div className="text-center">
      {
        states.includes(currentState.status) ? (
          <div>
          <div className="top">
            {renderTop(opposingPlayer, currentState)}
            
          </div>
          <hr />
          </div>
        ) : null
      }
      <div className="view">
        {renderTableView(currentState)}
      </div>
      {
        states.includes(currentState.status) ? (
          <div className="bottom">
            <hr />
            {renderBottom(currentPlayer, currentState)}
          </div>
        ) : null
      }
    </div>
  );
};

const ViewGame = ({
  loading, currentState,
}) => (
    !loading ? currentState.playerOne ? renderTableLayout(currentState) : <Redirect to="/games" />  : <Loading />
);

ViewGame.defaultProps = {
  currentState: <Redirect to="/games" />,
};

ViewGame.propTypes = {
  loading: PropTypes.bool.isRequired,
  currentState: PropTypes.object,
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
