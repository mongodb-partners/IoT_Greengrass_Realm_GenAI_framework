import Realm, { BSON } from 'realm';

export class Vehicle extends Realm.Object {
  _id;
  vin;
  make;
  model;

  static schema = {
    name: 'Vehicle',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new BSON.ObjectId() },
      vin: 'string',
      make: 'string',
      model: 'string'
    }
  };
}
