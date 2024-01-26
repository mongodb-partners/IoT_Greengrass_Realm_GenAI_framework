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
