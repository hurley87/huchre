/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
 
const Messages = new Mongo.Collection('Messages');

export default Messages;