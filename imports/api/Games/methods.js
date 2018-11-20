import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Games from './Games';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'games.insert': function gamesInsert(doc) {
    check(doc, {
      score: Number,
    });
    const suits = ['S', 'D', 'H', 'C'];
    const cards = [];

    let count = 9;

    while (count <= 14) {
      for (const i in suits) {
        cards.push({
          suit: suits[i],
          value: count,
        });
      }
      count += 1;
    }

    cards.push({
      suit: 'J',
      value: 15,
    });

    try {
      return Games.insert({
        playerOne: this.userId,
        playerOneUsername: Meteor.users.findOne(this.userId).username,
        score: doc.score,
        playerTwo: '',
        playerTwoUsername: '',
        playerOneScore: 0,
        playerTwoScore: 0,
        playerOneHand: [],
        playerOneFirst: [],
        playerOneSecond: [],
        playerOneThird: [],
        playerTwoHand: [],
        playerTwoFirst: [],
        playerTwoSecond: [],
        playerTwoThird: [],
        dealer: this.userId,
        handCount: 0,
        currentPlayer: this.userId,
        deck: cards,
        status: 'invite-sent',

      });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'games.update': function gamesUpdate(doc) {
    check(doc, {
      _id: String,
      playerOne: String,
      playerOneUsername: String,
      score: Number,
      playerTwo: String,
      playerTwoUsername: String,
      playerOneScore: Number,
      playerTwoScore: Number,
      playerOneHand: Array,
      playerOneFirst: Array,
      playerOneSecond: Array,
      playerOneThird: Array,
      playerTwoHand: Array,
      playerTwoFirst: Array,
      playerTwoSecond: Array,
      playerTwoThird: Array,
      dealer: String,
      handCount: Number,
      currentPlayer: String,
      deck: Array,
      status: String,
    });

    let newDoc = doc;
    if (doc.playerTwo != '') {
      newDoc.playerTwoUsername = Meteor.users.findOne(doc.playerTwo).username;
    }

    try {
      const gameId = newDoc._id;
      Games.update(gameId, { $set: newDoc });
      return gameId;
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
