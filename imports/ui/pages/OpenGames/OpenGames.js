import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import GamesCollection from '../../../api/Games/Games';
import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';

const joinGame = (game, history) => {
  let newGame = game;
  newGame.challenger = Meteor.userId();
  console.log(newGame);
  Meteor.call('games.update', newGame, (error, gameId) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      history.push(`/games/${game._id}`);
    }
  });
};

const OpenGames = ({
  loading, games, match, history,
}) => (!loading ? (
  <div className="OpenGames">
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
                <td>{timeago(game.updatedAt)}</td>
                <td>{monthDayYearAtTime(game.createdAt)}</td>
                {
                  Meteor.userId() == game.creator || Meteor.userId() == game.challenger ? (
                    <td>
                      <Button
                        bsStyle="primary"
                        onClick={() => history.push(`${match.url}/${game._id}`)}
                        block
                      >
                        View Game
                      </Button>
                    </td>
                    ) : '' == game.challenger ? (
                    <td>
                      <Button
                        bsStyle="success"
                        onClick={() => joinGame(game, history)}
                        block
                      >
                        Join Game
                      </Button>
                    </td>
                  ) : null
                }
            </tr>
          ))}
        </tbody>
      </Table> : <div>There are no open games.</div>}
  </div>
) : <Loading />);

OpenGames.propTypes = {
  loading: PropTypes.bool.isRequired,
  games: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('openGames');
  const games = GamesCollection.find({
    challenger: '', 
  }).fetch();
  console.log(games)
  return {
    loading: !subscription.ready(),
    games,
  };
})(OpenGames);
