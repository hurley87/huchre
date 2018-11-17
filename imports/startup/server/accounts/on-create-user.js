import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  const userToCreate = user;
  if (options.profile) userToCreate.profile = options.profile;
  userToCreate.profile.points = 0;
  userToCreate.profile.games_played = 0;
  userToCreate.profile.euchres_recieved = 0;
  userToCreate.profile.euchres_given = 0;
  userToCreate.profile.in_game = false;
  return userToCreate;
});

