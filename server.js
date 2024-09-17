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

// Index page
app.get('/', (req, res) => {
    res.render('pages/index', {
        customStylesheet: '/public/css/index.css'
    })
})

// Events page
app.get('/events', (req, res) => {
    res.render('pages/events', {
        events: getEvents(),
        customStylesheet: '/public/css/events.css'
    })
})

// Register page
app.get('/register/:id', (req, res) => {
    const events = getEvents()
    const eventId = parseInt(req.params.id);
    const selectedEvent = events.find(item => item.id == eventId);
    res.render('pages/register', {
        events: events,
        selectedEvent,
        selectedEventId: eventId,
        customStylesheet: '/public/css/register.css'
    });
});

// POST route to handle registration
app.post('/register/:id', (req, res) => {
    const registrations = getRegistrations();
    const newRegistration = {
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

// Admin pages
app.get('/admin', (req, res) => {
    const events = getEvents()
    res.render('pages/admin/dashboard', {
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
        event,
        registrations: eventRegistrations,
        customStylesheet: '/public/css/admin-event.css'
    });
})

// Admin Edit - Attendees Delete
app.post('/admin/edit/:id/:personId', (req, res) => {
    const { id, personId } = req.params;
    const registrations = getRegistrations();
    
    // Filter out the registration to delete
    const updatedRegistrations = registrations.filter(registration => registration.id != id || registration.id != personId);
    saveRegistrations(updatedRegistrations);
    updateAttendees(id, 0);
    res.redirect('/admin/edit/' + id);
})

// Admin Edit - POST
app.post('/admin/edit/:id', (req, res) => {
    const events = getEvents();
    const eventIndex = events.findIndex(event => event.id == req.params.id);
    events[eventIndex].description = req.body.description
    events[eventIndex].name = req.params.name
    saveEvents(events);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})

// Date formatter
function formatDate() {
    const newDate = new Date().toISOString().slice(0, 10);
    const formattedDate = newDate.split('-');
    const mmddyyyy = `${formattedDate[1]}/${formattedDate[2]}/${formattedDate[0]}`;
    return mmddyyyy;
}

// Function to get events from events.json
function getEvents() {
    const data = fs.readFileSync(path.join(__dirname, './data/events.json'), 'utf8');
    return JSON.parse(data)
}

// Function to get registered people from registrations.json
function getRegistrations() {
    const data = fs.readFileSync('./data/registrations.json', 'utf8');
    return JSON.parse(data)
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
    } else {
        events[eventIndex].attendees--
    }
    saveEvents(events);
}