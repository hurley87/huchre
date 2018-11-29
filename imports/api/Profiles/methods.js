/* eslint-disable no-empty */
import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Profiles from './Profiles';
import rateLimit from '../../modules/rate-limit';


Meteor.methods({
  'profiles.insert': function profilesInsert(doc) {
    check(doc, {
      username: String,
      score: Number,
      playerId: String,
    });

    const profile = Profiles.find({ username: doc.username }).fetch();
    if (profile.length === 0) {
      Profiles.insert({
        username: doc.username,
        playerId: doc.playerId,
        score: doc.score,
      });
    } else {
      Profiles.update({ username: doc.username }, {
        $set: {
          updatedAt: (new Date()).toISOString(),
        },
        $inc: {
          score: doc.score,
        },
      });
    }


    // try {
    //   return Profiles.insert(doc);
    // } catch (exception) {
    //   throw new Meteor.Error('500', exception);
    // }
  },
  'profiles.update': function profilesUpdate(doc) {
    check(doc, {
      _id: String,
      username: String,
      score: Number,
      playerId: String,
    });

    try {
      const profileId = doc._id;
      Profiles.update(profileId, { $set: doc });
      return profileId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'profiles.remove': function profilesRemove(profileId) {
    check(profileId, String);

    try {
      return Profiles.remove(profileId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'profiles.insert',
    'profiles.update',
    'profiles.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
