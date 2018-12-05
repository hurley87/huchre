import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button, Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import GamesCollection from '../../../api/Games/Games';
import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';

const joinGame = (game, history) => {
  let newGame = game;
  newGame.playerTwo.id = Meteor.userId();
  newGame.status = "invite-accepted";
  Meteor.call('games.update', newGame, (error) => {
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
      <Row>
          {games.map(game => (
            <Col key={game._id} sm={3}>
              <div className='well text-center'>
                <h5 style={{marginTop: '0px'}}>Play {game.playerOne.username} up to {game.limit}</h5>
                <Button
                  className='button'
                  onClick={() => joinGame(game, history)}
                >
                  Join Game
                  </Button>
              </div>
            </Col>
          ))}
      </Row> : <div>There are no open games.</div>}
  </div>
) : <Loading />);

OpenGames.propTypes = {
  loading: PropTypes.bool.isRequired,
  games: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('openGames');
  const games = GamesCollection.find({
    'playerTwo.id': '', 
  }).fetch();
  console.log(games)
  return {
    loading: !subscription.ready(),
    games,
  };
})(OpenGames);
