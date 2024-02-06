import Realm, { BSON } from 'realm';

export class Part extends Realm.Object {
  _id;
  partNum;
  partName;
  vehicleId;

  static schema = {
    name: 'Part',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new BSON.ObjectId() },
      partNum: 'string',
      partName: 'string?',
      vehicleId: 'Vehicle'
    }
  };
}
