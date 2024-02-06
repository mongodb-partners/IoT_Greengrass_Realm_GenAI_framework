exports = async (user) => {
  const collection = context.services.get("mongodb-atlas").db("GreengrassIot").collection("User");
  if (user?.data?.email) {
    const externalUserId = new BSON.ObjectId();
    const existingUser = await collection.findOne({ email: user.data.email });
    if (!existingUser) {
      const doc = await collection.insertOne({
        _id: new BSON.ObjectId(user.id), 'userId': externalUserId, email: user.data.email,
        name: user?.data?.name ?? 'No Name'
      });
    }
  }
};