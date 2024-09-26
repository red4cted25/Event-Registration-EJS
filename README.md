# EventQuest [![pages-build-deployment](https://github.com/red4cted25/EventQuest/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/red4cted25/EventQuest/actions/workflows/pages/pages-build-deployment) [![npm](https://img.shields.io/npm/v/npm.svg?style=flat-square)](https://www.npmjs.com/package/npm) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/your/your-project/blob/master/LICENSE)
EventQuest is a web-based event registration system built using Node.js, Express, and EJS templating. It allows users to view and register for events, and includes an admin dashboard for managing events and registrations.
## Features
- **View Events**: Users can browse available events.
- **Event Registration**: Users can register for specific events by providing their name and email.
- **Admin Dashboard**: Administrators can manage events, view registered attendees, edit event details, and delete registrations.

## Tech 
- **Node.js**: JavaScript runtime used to build the backend.
- **Express**: Web framework for building server-side logic and handling routing.
- **EJS**: Embedded JavaScript templating engine for generating dynamic HTML pages.
- **CSS**: For styling the frontend with custom scrollbars and responsive design.
## Installation

1. Clone the repository:

``` bash
git clone https://github.com/red4cted25/EventQuest.git
cd EventQuest
```

2. Install the dependencies:
```bash
npm install
```

3. Run the server:
```bash
npm run start
```

4. Access the app at:
```
http://localhost:5000
```
## File Structure
```
Event-Registration-EJS/
│
├── data/
│   ├── events.json         # Stores event details
│   └── registrations.json  # Stores user registration details
│
├── public/
│   ├── css/
│   │   ├── admin-event.css # Admin edit/add styling
│   │   ├── dashboard.css   # Admin page styling
│   │   ├── events.css      # Events page styling
│   │   ├── index.css       # Home page styling
│   │   ├── register.css    # Register page styling
│   │   └── styles.css      # Global styling
│   ├── images/             
│   │   └── favicon.ico     # Favicon
│   └── js/
│       └── main.js         # JS functionality for each page
│
├── views/
│   ├── layouts/
│   │   └── main.ejs        # Main layout template
│   ├── pages/
│   │   ├── index.ejs       # Home page
│   │   ├── events.ejs      # Events listing page
│   │   ├── register.ejs    # Event registration page
│   │   └── admin/          
│   │       ├── add-event.ejs   # Admin add event page
│   │       ├── dashboard.ejs   # Admin dashboard page
│   │       └── edit-event.ejs  # Admin edit event page
│
├── server.js               # Main application server
├── package.json            # NPM configuration file
└── README.md               # Project documentation
```
## Routes
### Public Routes
- `GET /`: Renders the homepage (`index.ejs`).
- `GET /events`: Displays the list of events (`events.ejs`).
- `GET /register/:id`: Shows the registration form for a specific event (`register.ejs`).
- `POST /register`: Handles the submission of event registrations.

### Admin Routes
- `GET /admin` - Displays the admin dashboard (`dashboard.ejs`) showing all events.
- `POST /admin/delete/:id` - Deletes an event with the specified ID.
- `GET /admin/edit/:id` - Opens the event edit page (`edit-event.ejs`).
- `POST /admin/edit/:id` - Handles the submission of updated event details.
- `POST /admin/edit/delete/:personId` - Deletes a participant from an event.
- `GET /admin/add` - Shows the form to add a new event (`add-event.ejs`).
- `POST /admin/add` - Submits new event data to add to the event list.


## Functions

- `formatDate(dateInput)`
  - Creates new Date if dateInput is not added when calling the function
  - Formats dates based on the mm/dd/yyyy format
  - Returns formatted date

- `getEvents()`
  - Reads and parses JSON data from events.json
  - Sorts events list by closest date first
  - Returns sorted events list

- `getRegistrations()`
  - Reads and parses JSON data from registrations.json
  - Sorts registrations list by closest date first
  - Returns sorted registrations list

- `saveEvents(events)`
  - Writes to events.json to save data

- `saveRegistrations(registrations)`
  - Writes to events.json to save data
  
- `updateAttendees(eventId, value)`
  - Updates attendees value for a register page POST action
  - eventId is passed to find the correct event being registered for
  - value is used to determine if the attendees should be added or subtracted from
  - Uses `saveEvents(events)` to update information

- `newId(jsonData, idField)`
  - Generates unique ID for attendees and events
  - jsonData is passed to find the json list to get the length of
  - idField is passed to choose between personId or eventId when generating an id
  - Returns new, unique id
## Example Usage
### Registering for an Event

1. Visit the Home Page
   - Navigate to the home page at `http://localhost:5000/`. You’ll be greeted with buttons to choose between upcoming events and the admin dashboard.
2. View Event Details
   - Click on the Events tab in the navigation bar to see the list of available events.
   - Each event will display key information such as the name, date, and description.
3. Register for an Event
   - Click the Register button next to the event you'd like to attend.
   - You will be taken to the registration form where you can enter your Name and Email.
   - Click Submit to complete your registration.
4. Confirmation
   - After registering, you will see a success message confirming your spot in the event.
   - Your registration details will be stored in registrations.json in the project’s data directory.

### Admin Panel Example
1. Log in to the Admin Dashboard
   - Navigate to `http://localhost:5000/admin` to access the Admin dashboard.
2. Manage Events
   - From the dashboard, you can view all events, edit event details, and add new events. Use the Edit or Delete buttons to manage the existing events.
   - You can also click Add Event to create a new one.
3. Download Event & Registration Data
   - In the admin panel, there are options to download the events and registrations data as JSON files. 
   - Click the Download Events JSON or Download Registrations JSON button to download them.
## Contributing
Feel free to contribute by opening issues or submitting pull requests. For major changes, please open an issue first to discuss what you would like to change.


## License

[MIT](https://choosealicense.com/licenses/mit/)
