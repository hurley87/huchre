import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import GamesCollection from '../../../api/Games/Games';
import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';
import NewGame from '../NewGame/NewGame';
import CurrentGames from '../CurrentGames/CurrentGames';
import OpenGames from '../OpenGames/OpenGames';
import { Redirect } from 'react-router-dom';

const Games = ({
  loading, openLenth, currentGames, match, history,
}) => (!loading ? (
  <div className="Games">
    {
      currentGames.length > 0 ? <Redirect to={`/games/${currentGames[0]._id}`} /> : openLenth > 0 ? <OpenGames /> : <NewGame />
    }
  </div>
) : <Loading />);

Games.propTypes = {
  loading: PropTypes.bool.isRequired,
  games: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('unfinishedGames');
  const openLenth = GamesCollection.find({
    challenger: '',
  }).fetch().length;
  const currentGames = GamesCollection.find({
    $or: [
      { challenger: Meteor.userId() },
      { creator: Meteor.userId() },
    ],
  }).fetch();

  return {
    loading: !subscription.ready(),
    openLenth,
    currentGames,
  };
})(Games);
