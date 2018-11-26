/* eslint-disable no-empty */
import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Games from './Games';
import rateLimit from '../../modules/rate-limit';


Meteor.methods({
  'games.insert': function gamesInsert(doc) {
    check(doc, {
      limit: Number,
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
        limit: doc.limit,
        playerOne: {
          id: this.userId,
          username: Meteor.users.findOne(this.userId).username,
          score: 0,
          hand: [],
          board: [],
        },
        playerTwo: {
          id: '',
          username: '',
          score: 0,
          hand: [],
          board: [],
        },
        dealer: this.userId,
        maker: '',
        currentPlayer: this.userId,
        handCount: 0,
        deck: cards,
        status: 'invite-sent',
        trump: '',
      });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'games.update': function gamesUpdate(doc) {
    check(doc, {
      _id: String,
      limit: Number,
      playerOne: Object,
      playerTwo: Object,
      dealer: String,
      maker: String,
      handCount: Number,
      currentPlayer: String,
      deck: Array,
      status: String,
      trump: String,
    });

    const newDoc = doc;
    if (doc.playerTwo.id !== '') newDoc.playerTwo.username = Meteor.users.findOne(doc.playerTwo.id).username

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
