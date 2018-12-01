import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Profiles from '../Profiles';

Meteor.publish('profiles', function profiles() {
  return Profiles.find({}, {limit: 10});
});

// Note: profiles.view is also used when editing an existing profile.
Meteor.publish('profiles.view', function profilesView(profileId) {
  check(profileId, String);
  return Profiles.find({ _id: profileId, owner: this.userId });
});
