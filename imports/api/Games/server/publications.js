import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Games from '../Games';

Meteor.publish('games', function games() {
  return Games.find({ owner: this.userId });
});

// Note: games.view is also used when editing an existing game.
Meteor.publish('games.view', function gamesView(gameId) {
  check(gameId, String);
  return Games.find({ _id: gameId, owner: this.userId });
});
