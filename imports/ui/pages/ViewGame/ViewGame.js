import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Games from '../../../api/Games/Games';
import Loading from '../../components/Loading/Loading';
import { Redirect } from 'react-router-dom';
import InviteFriend from "../InviteFriend/InviteFriend";

const endGame = (gameId, history) => {
  if (confirm('Are you sure you want to end this game?')) {
    Meteor.call('games.remove', gameId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Game deleted!', 'success');
        history.push('/games');
      }
    });
  }
};

const renderGame = (doc, match, history) => (doc ? (
  <div className="ViewGame">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ doc && doc.title }</h4>
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button onClick={() => endGame(doc._id, history)} className="text-danger">
            End Game
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </div>
    { doc && doc.body }
  </div>
) : <Redirect to={`/games`} /> );


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

  console.log(doc)

  return {
    loading: !subscription.ready(),
    doc,
  };
})(ViewGame);
