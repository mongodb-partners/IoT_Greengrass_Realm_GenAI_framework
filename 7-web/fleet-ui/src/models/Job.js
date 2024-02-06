import Realm, { BSON } from 'realm';

export class Job extends Realm.Object {
  _id;
  assignedTo;
  createdAt;
  notes;
  status;
  type;
  vehicleId;

  static schema = {
    name: 'Job',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new BSON.ObjectId() },
      assignedTo: 'objectId',
      createdAt: 'date',
      notes: 'string',
      status: 'string',
      type: 'string',
      vehicleId: 'Vehicle'
    }
  };
}
