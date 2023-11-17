import Realm, { BSON } from 'realm';

export class User extends Realm.Object {
  _id;
  name;
  email;

  static schema = {
    name: 'User',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new BSON.ObjectId() },
      name: 'string',
      email: 'string'
    }
  };
}
