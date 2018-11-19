import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Games from '../Games';

Meteor.publish('currentGames', function currentGames() {
  return Games.find({
    $or: [
      { playerTwo: this.userId },
      { playerOne: this.userId, playerTwo: { $ne: '' } },
    ],
  });
});

Meteor.publish('openGames', function openGames() {
  return Games.find({ playerTwo: "" });
});

Meteor.publish('unfinishedGames', function currentGames() {
  return Games.find({
    $or: [
      { playerTwoScore: { $lte: 100 } },
      { playerOneScore: { $lte: 100 } },
    ],
  });
});


// Note: games.view is also used when editing an existing game.
Meteor.publish('games.view', function gamesView(gameId) {
  check(gameId, String);
  return Games.find({ _id: gameId });
});
