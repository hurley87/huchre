import React from 'react';
import PropTypes from 'prop-types';
import { Table, Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import CurrentGamesCollection from '../../../api/Games/Games';
import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';

const CurrentGames = ({
  loading, games, match, history,
}) => (!loading ? (
  <div className="CurrentGames">
    {games.length ?
      <Table responsive>
        <thead>
          <tr>
            <th>Last Updated</th>
            <th>Created</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {games.map(game => (
            <tr key={game._id}>
              <td>{timeago(game.createdAt)}</td>
              <td>{monthDayYearAtTime(game.createdAt)}</td>
              <td>
                <Button
                  bsStyle="primary"
                  onClick={() => history.push(`${match.url}/${game._id}`)}
                  block
                >
                  View Game
              </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table> : <div>You aren't in any games yet.</div>}
  </div>
) : <Loading />);

CurrentGames.propTypes = {
  loading: PropTypes.bool.isRequired,
  games: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('currentGames');
  const games = CurrentGamesCollection.find({
    $or: [
      { challenger: Meteor.userId() },
      { creator: Meteor.userId(), challenger: { $ne: '' } },
    ],
  }).fetch();
  console.log(games);
  return {
    loading: !subscription.ready(),
    games,
  };
})(CurrentGames);
