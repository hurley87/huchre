import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Messages from '../Messages';

Meteor.publish('messages', function messages(gameId) {
  check(gameId, String);
  return Messages.find({ gameId });
});

// Note: messages.view is also used when editing an existing message.
Meteor.publish('messages.view', function messagesView(messageId) {
  check(messageId, String);
  return Messages.find({ gameId: messageId });
});
