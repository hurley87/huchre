import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import GamesCollection from '../../../api/Games/Games';
import Loading from '../../components/Loading/Loading';
import NewGame from '../NewGame/NewGame';
import OpenGames from '../OpenGames/OpenGames';
import { Redirect } from 'react-router-dom';

const Games = ({
  loading, openLength, currentGames, match, history,
}) => (!loading ? (
  <div className="Games">
    {
      currentGames.length > 0 ? <Redirect to={`/games/${currentGames[0]._id}`} /> : openLength > 0 ? <OpenGames /> : <NewGame />
    }
  </div>
) : <Loading />);

Games.propTypes = {
  loading: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('unfinishedGames');
  const openLength = GamesCollection.find({
    'playerTwo.id': '',
  }).fetch().length;
  const currentGames = GamesCollection.find({
    $or: [
      { 'playerTwo.id': Meteor.userId() },
      { 'playerOne.id': Meteor.userId() },
    ],
  }).fetch();

  console.log('whooaaaa');
  console.log(GamesCollection.find({
  }).fetch())

  return {
    loading: !subscription.ready(),
    openLength,
    currentGames,
  };
})(Games);
