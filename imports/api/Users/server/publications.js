import { Meteor } from 'meteor/meteor';

Meteor.publish('users.editProfile', function usersProfile() {
  return Meteor.users.find(this.userId, {
    fields: {
      emails: 1,
      profile: 1,
      services: 1,
    },
  });
});

Meteor.publish('usersAll', function usersAll() {
  console.log('HEYYY');
  return Meteor.users.find({ inGame: false }, { fields: { 'profile': 1 } });
});

