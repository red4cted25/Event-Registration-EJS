var express = require('express')
var app = express()
const fs = require('fs')
const PORT = 5000
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

// Middleware
app.use(expressLayouts);
app.set('layout', 'layouts/main');
// express.static allows css/js to be used in files without MIME error
app.use('/public', express.static('public'));
// express.urlencoded ({extended:true}) allows req.body to be taken from forms with POST 
app.use(bodyParser.urlencoded({ extended: true }));

// Set the view engine to ejs
app.set('view engine', 'ejs')

// ! Index page
app.get('/', (req, res) => {
    res.render('pages/index', {
        pageTitle: 'Home',
        customStylesheet: '/public/css/index.css'
    })
})

// ! Events page
app.get('/events', (req, res) => {
    res.render('pages/events', {
        pageTitle: 'Events',
        events: getEvents(),
        customStylesheet: '/public/css/events.css'
    })
})

// ! Register page
app.get('/register/:id', (req, res) => {
    const events = getEvents()
    const eventId = parseInt(req.params.id);
    const selectedEvent = events.find(item => item.id == eventId);
    res.render('pages/register', {
        pageTitle: `Register For ${selectedEvent.name}`,
        events: events,
        selectedEvent,
        selectedEventId: eventId,
        customStylesheet: '/public/css/register.css'
    });
});

// POST route to handle registration
app.post('/register', (req, res) => {
    const registrations = getRegistrations();
    const registrationId = newId(registrations, 'personId');
    const newRegistration = {
        personId: registrationId,
        name: req.body.personName,
        email: req.body.email,
        date: formatDate(),
        eventId: req.body.eventId
    }
    registrations.push(newRegistration)
    saveRegistrations(registrations);
    updateAttendees(req.body.eventId, 1);
    res.redirect('/register/' + req.body.eventId + '?success=true')
});

// ! Admin Pages
app.get('/admin', (req, res) => {
    const events = getEvents()
    res.render('pages/admin/dashboard', {
        pageTitle: 'Admin',
        events: events,
        customStylesheet: '/public/css/dashboard.css'
    })
})

// Admin Delete
app.post('/admin/delete/:id', (req, res) => {
    let events = getEvents();
    events = events.filter(event => event.id != req.params.id);
    saveEvents(events);
    res.redirect('/admin');
})

// Admin Edit
app.get('/admin/edit/:id', (req, res) => {
    const events = getEvents();
    const registrations = getRegistrations();
    const eventRegistrations = registrations.filter(registration => registration.eventId == req.params.id);
    const event = events.find(event => event.id == req.params.id);
    res.render('pages/admin/edit-event', {
        pageTitle: `Edit ${event.name}`,
        event,
        registrations: eventRegistrations,
        customStylesheet: '/public/css/admin-event.css'
    });
})

// Admin Edit - Attendees Delete
app.post('/admin/edit/delete/:personId', (req, res) => {
    let registrations = getRegistrations();
    let eventId = parseInt(req.body.eventId)
    
    // Filter out the registration to delete
    registrations = registrations.filter(registration => registration.personId != req.params.personId);
    saveRegistrations(registrations);
    updateAttendees(eventId, 0);
    res.redirect('/admin/edit/' + eventId);
})

// Admin Edit - POST
app.post('/admin/edit/:id', (req, res) => {
    const events = getEvents();
    const eventIndex = events.findIndex(event => event.id == req.params.id);
    events[eventIndex].description = req.body.description
    events[eventIndex].name = req.body.name
    events[eventIndex].date = formatDate(req.body.date)
    saveEvents(events);
    res.redirect('/admin');
});

// Admin Add
app.get('/admin/add', (req, res) => {
    const events = getEvents();
    res.render('pages/admin/add-event', { 
        pageTitle: 'Add Event',
        events,
        customStylesheet: '/public/css/admin-event.css'
    });
})

// Admin Add - POST
app.post('/admin/add', (req, res) => {
    const events = getEvents();
    const newEvent = {
        id: newId(events, 'id'),
        name: req.body.name,
        date: formatDate(req.body.date), 
        capacity: parseInt(req.body.capacity),
        location: req.body.location,
        description: req.body.description,
        attendees: 0  
    };
    events.push(newEvent);
    saveEvents(events);
    res.redirect('/admin');  
});

// ! Download files for admin when pushing through render.com
// Route to download events.json
app.get('/download/events', (req, res) => {
    const file = path.join(__dirname, './data/events.json');
    res.download(file);
});

// Route to download registrations.json
app.get('/download/registrations', (req, res) => {
    const file = path.join(__dirname, './data/registrations.json');
    res.download(file);
});

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})

// ! FUNCTIONS

// Date formatter
function formatDate(dateInput) {
    const newDate = dateInput ? new Date(dateInput) : new Date(); // Use current date if no input
    const formattedDate = [
        (newDate.getMonth() + 1).toString().padStart(2, '0'),  // Month (0-based, so +1)
        newDate.getDate().toString().padStart(2, '0'),          // Day
        newDate.getFullYear()                                  // Year
    ].join('/');
    return formattedDate;
}

// Function to get events from events.json
function getEvents() {
    const data = fs.readFileSync(path.join(__dirname, './data/events.json'), 'utf8');
    let events = JSON.parse(data)

    // Sort events by date in descending order (closest date first)
    events = events.sort((a, b) => new Date(a.date) - new Date(b.date));

    return events
}

// Function to get registered people from registrations.json
function getRegistrations() {
    const data = fs.readFileSync('./data/registrations.json', 'utf8');
    let registrations = JSON.parse(data)
    
    // Sort registrations by date in descending order (closest date first)
    registrations = registrations.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return registrations
}

// Function to write registrations
const saveRegistrations = (registrations) => {
    fs.writeFileSync('./data/registrations.json', JSON.stringify(registrations, null, 2), 'utf8')
}

// Function to write events
function saveEvents(events) {
    fs.writeFileSync('./data/events.json', JSON.stringify(events, null, 2), 'utf8');
}

// Function to update event attendees value for register post
function updateAttendees(eventId, value) {
    const events = getEvents();
    const eventIndex = events.findIndex(item => item.id == eventId);
    
    if(value == 1) {
        events[eventIndex].attendees++
    }
    if (value == 0) {
        events[eventIndex].attendees--
    }
    saveEvents(events);
}

// Function to generate a new unique ID
function newId(jsonData, idField) {
    let newId = jsonData.length + 1;
    while (jsonData.some(item => item[idField] == newId)) {
        newId++;
    }
    return newId; 
}