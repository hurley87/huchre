import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Games from './Games';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'games.insert': function gamesInsert(doc) {
    check(doc, {
      title: String,
      body: String,
    });

    try {
      return Games.insert({ owner: this.userId, ...doc });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'games.update': function gamesUpdate(doc) {
    check(doc, {
      _id: String,
      title: String,
      body: String,
    });

    try {
      const gameId = doc._id;
      Games.update(gameId, { $set: doc });
      return gameId; // Return _id so we can redirect to game after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'games.remove': function gamesRemove(gameId) {
    check(gameId, String);

    try {
      return Games.remove(gameId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'games.insert',
    'games.update',
    'games.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
