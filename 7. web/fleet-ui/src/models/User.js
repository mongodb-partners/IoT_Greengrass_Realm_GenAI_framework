import Realm, { BSON } from 'realm';

export class User extends Realm.Object {
  _id;
  userId;
  name;
  email;

  static schema = {
    name: 'User',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new BSON.ObjectId() },
      name: 'string',
      userId: 'objectId',
      email: 'string'
    }
  };
}
