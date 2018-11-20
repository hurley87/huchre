/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Games from '../../../api/Games/Games';
import Loading from '../../components/Loading/Loading';
import { Redirect } from 'react-router-dom';
import InviteFriend from '../InviteFriend/InviteFriend';

const endGame = (gameId) => {
  if (confirm('Are you sure you want to end this game?')) {
    Meteor.call('games.remove', gameId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Game ended!', 'success');
      }
    });
  }
};

const startGame = (game) => {
  const newGame = game;
  newGame.status = 'started';
  Meteor.call('games.update', game, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Game started!', 'success');
    }
  });
};

const renderTop = doc => (doc ? (
  <Row className="text-center">
    <Col xs={12}>
      {doc.username}
    </Col>
    <Col xs={12}>
      hand
    </Col>
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

const renderBottom = doc => (doc ? (
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
    <Col xs={12}>
      hand
    </Col>
    <Col xs={12}>
      {doc.username}
    </Col>
  </Row>
) : <Redirect to="/games" />);

const renderTable = doc => (doc ? (
  <div className="ViewGame">
    <Row>
      <Col xs={12}>
        <h4 className="pull-left">{doc && doc.status}</h4>
        <Button onClick={() => endGame(doc._id)} > End Game</Button>
        <br />
      </Col>
    </Row>
    {
      doc.playerOne && doc.playerOne.id !== Meteor.userId() ? renderTop(doc.playerOne) : renderTop(doc.playerTwo)
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
      doc.playerTwo && doc.playerTwo.id !== Meteor.userId() ? renderBottom(doc.playerOne) : renderBottom(doc.playerTwo)
    }
  </div>
) : <Redirect to="/games" />);

const renderDeal = doc => (doc ? (
  <Row className="text-center">
    Deal
  </Row>
) : <Redirect to="/games" />);


const renderPickup = doc => (doc ? (
  <Row className="text-center">
    Pickup
  </Row>
) : <Redirect to="/games" />);

const renderMake = doc => (doc ? (
  <Row className="text-center">
    make
  </Row>
) : <Redirect to="/games" />);

const renderStickDealer = doc => (doc ? (
  <Row className="text-center">
    stickdealer
  </Row>
) : <Redirect to="/games" />);

const ViewGame = ({
  loading, doc,
}) => (
  !loading ? doc && doc.status == 'invite-sent' ? <InviteFriend /> :
    doc.status == 'deal' ? renderDeal(doc) :
      doc.status == 'pickup' ? renderPickup(doc) :
        doc.status == 'make' ? renderMake(doc) :
          doc.status == 'stickdealer' ? renderStickDealer(doc) :
            renderTable(doc) : <Loading />
);

ViewGame.defaultProps = {
  doc: <Redirect to="/games" />,
};

ViewGame.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const gameId = match.params._id;
  const subscription = Meteor.subscribe('games.view', gameId);
  const doc = Games.findOne(gameId);

  console.log(doc);

  return {
    loading: !subscription.ready(),
    doc,
  };
})(ViewGame);
