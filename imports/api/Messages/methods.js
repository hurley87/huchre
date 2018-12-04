/* eslint-disable prefer-destructuring */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Messages from './Messages';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'messages.insert': function messagesInsert(doc) {
    check(doc, {
      gameId: String,
      text: String,
      playerId: String,
    });

    const username = Meteor.users.findOne(doc.playerId).username;

    try {
      return Messages.insert({ username, ...doc });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'messages.update': function messagesUpdate(doc) {
    check(doc, {
      _id: String,
      title: String,
      body: String,
    });

    try {
      const messageId = doc._id;
      Messages.update(messageId, { $set: doc });
      return messageId; // Return _id so we can redirect to message after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'messages.remove': function messagesRemove(messageId) {
    check(messageId, String);

    try {
      return Messages.remove(messageId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'messages.insert',
    'messages.update',
    'messages.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
