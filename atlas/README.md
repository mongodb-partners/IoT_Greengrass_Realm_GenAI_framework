# Atlas 

## App Services

### Prerequisites

* S3 bucket to which vehicle sensor data is exported.
* Credentials (Access and Secret key) to upload to the above S3 bucket.
* App on app services.
  * If you don't have an app, create a new one in a region close to your cluster. <https://www.mongodb.com/docs/atlas/app-services/apps/create/> goes into detail on how you can create an app via the UI or CLI

### Realm CLI

We'll be using the Realm CLI to configure your app in app services.

To install the Realm CLI and login, please refer to the below link
<https://www.mongodb.com/docs/atlas/app-services/cli/#installation>

### Import configuration

Once you login, open up a terminal and go to the [app-services](./app-services/) folder. This holds the app configuration you'll need to import. Run the below command to import the configuration to your app.

```bash
realm-cli push --local .\ --remote app-id
```

*Replace app-id with the id of your app service app.*

### App secrets

**NOTE - Secrets are not available in the app config and will need to be manually created before the app is fully functional.**

#### Create Secrets

We'll need to create the following secrets.

1. AWSAccessKeyId
2. AWSSecretAccessKey

These are used to upload sensor data into your S3 bucket for analysis. 

To create the secrets, log into Atlas and open up your app in app services.

1. Click Values in the left navigation menu and then click Create New Value. Enter the name and then select Secret for the type.
2. Enter the secret value in the Add Content input.
3. Once you've defined the secret, click Save. If your application deployment drafts enabled, click Review & Deploy to deploy the changes.

Once done, we'll need to create 2 more values that link to these secrets to access them

#### Access Secrets

You cannot directly read the value of a Secret after defining it. To access it, we'll be creating links to them.

We'll need to create the following links.

1. AWSAccessKeyIdRef
2. AWSSecretAccessKeyRef

To create them, once again open your app in atlas.

1. Click Values in the left navigation menu and then click Create New Value. Enter the name and then select Value for the type.
2. Choose Link to Secret in the Add Content input and in the dropdown choose the previously created secrets.
3. Once you've defined the links, click Save. If your application deployment drafts enabled, click Review & Deploy to deploy the changes.

### Configure target S3 Bucket

To update the name of S3 bucket, go to Functions in the left navigation menu and click open exportToS3

In the following code, change the Bucket value with your bucket name.

```javascript
const params = {
  Bucket: 'aws-iot-greengrass',
  Key: `IIoT/${String(value._id)}.txt`,
  Body: `[${JSON.stringify(body)}]`
}
```

Save and deploy if necessary.
