import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import MessagesCollection from '../../../api/Messages/Messages';
import Loading from '../../components/Loading/Loading';

const handleRemove = (messageId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('messages.remove', messageId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Message deleted!', 'success');
      }
    });
  }
};

const Messages = ({
  loading, messages, match, history,
}) => (!loading ? (
  <div className="Messages">
    {messages.length ?
        <div className="messages">
          {messages.map(({
            _id, username, text,
          }) => (
            <p key={_id}>
                <b>{username}:</b> {text}
            </p>
          ))}
        </div>
        : <Alert bsStyle="warning">No messages yet!</Alert>}
  </div>
) : <Loading />);

Messages.propTypes = {
  loading: PropTypes.bool.isRequired,
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('messages', location.pathname.split('/')[2]);
  console.log(MessagesCollection.find().fetch());
  return {
    loading: !subscription.ready(),
    messages: MessagesCollection.find().fetch(),
  };
})(Messages);
