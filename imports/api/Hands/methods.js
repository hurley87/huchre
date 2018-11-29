/* eslint-disable no-empty */
import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Hands from './Hands';
import rateLimit from '../../modules/rate-limit';


Meteor.methods({
  'hands.insert': function handsInsert(doc) {
    check(doc, {
      dealer: String,
      deck: Array,
      handCount: Number,
      maker: String,
      playerOneScore: Number,
      playerOneId: String,
      playerTwoId: String,
      playerTwoScore: Number,
      trump: String,
    });

    try {
      return Hands.insert(doc);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'hands.update': function handsUpdate(doc) {
    check(doc, {
      _id: String,
      dealer: String,
      deck: Array,
      handCount: Number,
      maker: String,
      playerOneScore: Number,
      playerTwoScore: Number,
      trump: String,
    });

    try {
      const handId = doc._id;
      Hands.update(handId, { $set: doc });
      return handId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'hands.remove': function handsRemove(handId) {
    check(handId, String);

    try {
      return Hands.remove(handId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'hands.insert',
    'hands.update',
    'hands.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
