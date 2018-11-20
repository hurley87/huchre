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

const firstPerson = doc => (doc ? (
  <Row>
    <Col xs={12}>
      1st player: {doc.playerOneUsername}
    </Col>
  </Row>
) : null);

const secondPerson = doc => (doc ? (
  <Row>
    <Col xs={12}>
      2nd player: {doc.playerTwoUsername}
    </Col>
  </Row>
) : null);

const renderGame = (doc, match, history) => (doc ? (
  <div className="ViewGame">
    <Row>
      <Col xs={12}>
        <h4 className="pull-left">{doc && doc.status}</h4>
        <Button
          bsStyle="danger"
          onClick={() => endGame(doc._id)}
          block
        >
         End Game
        </Button>
        <br />
      </Col>
    </Row>
    <Row>
      <Col xs={12}>
        {
          doc.playerOne == Meteor.userId() ? firstPerson(doc) : secondPerson(doc)
        }
      </Col>
    </Row>
    <Row>
      <Col xs={12}>
        {
          doc.playerTwo == Meteor.userId() ? firstPerson(doc) : secondPerson(doc)
        }
      </Col>
    </Row>
  </div>
) : <Redirect to="/games" />);


const ViewGame = ({
  loading, doc, match, history,
}) => (
  !loading ? doc && doc.playerTwo == '' ? <InviteFriend /> : renderGame(doc, match, history) : <Loading />
);

ViewGame.defaultProps = {
  doc: null,
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
