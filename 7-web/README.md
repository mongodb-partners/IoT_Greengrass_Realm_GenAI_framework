# Fleet UI

This React.js application allows users to view vehicles, parts, and jobs. This uses Realm [Device sync for Web](https://www.mongodb.com/docs/realm/web/install/) to sync jobs in real-time whenever the jobs gets updated in the Atlas. 

## Installation

To get started with the application, follow these steps:

1. **Navigate to the project directory:**

    ```bash
    cd frontend/fleet-ui
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

## Usage

To start the application, use the following commands:

1. **Start the development server:**

    ```bash
    npm start
    ```

2. **Open your browser:**

    Once the development server starts, the application will be available at: `http://localhost:3000`.

3. **Enable email-password authentication and create an App User with email and password in [Atlas App Services](https://www.mongodb.com/docs/atlas/app-services/users/create/#manually-create-an-email-password-user)**

![AppUser](../../media/app-services-user-create.png)
  
## Features

### Viewing Vehicles

- The application provides a section to view a list of vehicles.
- Each vehicle listing might include details such as make, model, vin etc.

### Viewing Parts

- Users can access a section to view different parts available.
- Part listings may include details like part number, vehicle etc.

### Viewing Jobs

- The application offers a section to view available jobs.
- Job listings can contain information such as status, notes, assignee, etc.
