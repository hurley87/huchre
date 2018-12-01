import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Table, Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import ProfilesCollection from '../../../api/Profiles/Profiles';
import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';

const handleRemove = (profileId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('profiles.remove', profileId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Profile deleted!', 'success');
      }
    });
  }
};

const Profiles = ({
  loading, profiles, match, history,
}) => (!loading ? (
  <div className="Profiles">
    <h5>Leaderboard</h5>
    {profiles.length ?
      <Table responsive>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Last Played</th>
            <th>Started</th>
            <th>Games</th>
            <th>Points</th>
            <th>PPG</th>
            <th>Wins</th>
          </tr>
        </thead>
        <tbody>
          {profiles.reverse().map((profile, i) => (
            <tr key={profile._id}>
              <td>{i + 1}</td>
              <td>{profile.username}</td>
              <td>{timeago(profile.updatedAt)}</td>
              <td>{timeago(profile.createdAt)}</td>
              <td>{profile.games}</td>
              <td>{profile.score}</td>
              <td>{(profile.score / profile.games).toFixed(2)}</td>
              <td>{profile.wins}</td>
            </tr>
          ))}
        </tbody>
      </Table> : <Alert bsStyle="warning">No profiles yet!</Alert>}
  </div>
) : <Loading />);

Profiles.propTypes = {
  loading: PropTypes.bool.isRequired,
  profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('profiles');
  const profiles = ProfilesCollection.find().fetch();
  return {
    loading: !subscription.ready(),
    profiles: _.sortBy(profiles, ['wins']),
  };
})(Profiles);
