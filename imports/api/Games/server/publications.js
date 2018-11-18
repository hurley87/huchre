import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Games from '../Games';

Meteor.publish('currentGames', function currentGames() {
  return Games.find({
    $or: [
      { challenger: this.userId },
      { creator: this.userId, challenger: { $ne: '' } },
    ],
  });
});

Meteor.publish('openGames', function openGames() {
  return Games.find({ challenger: "" });
});

Meteor.publish('unfinishedGames', function currentGames() {
  return Games.find({
    $or: [
      { challengerScore: { $lte: 100 } },
      { creatorScore: { $lte: 100 } },
    ],
  });
});


// Note: games.view is also used when editing an existing game.
Meteor.publish('games.view', function gamesView(gameId) {
  check(gameId, String);
  return Games.find({ _id: gameId });
});
