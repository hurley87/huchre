/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Profiles = new Mongo.Collection('Profiles');

Profiles.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Profiles.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Profiles.schema = new SimpleSchema({
  createdAt: {
    type: String,
    label: 'The date this profile was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this profile was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  username: {
    type: String,
    label: 'The title of the profile.',
  },
  score: {
    type: Number,
    label: 'The body of the profile.',
  },
  playerId: {
    type: String,
    label: 'The body of the profile.',
  },
  games: {
    type: Number,
    label: 'The body of the profile.',
  },
});

Profiles.attachSchema(Profiles.schema);

export default Profiles;
