var express = require('express')
var app = express()
const fs = require('fs')
const PORT = 5000
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const Event = require('./models/event');
const Registration = require('./models/registration');

// ! Middleware
app.use(expressLayouts);
app.set('layout', 'layouts/main');
// express.static allows css/js to be used in files without MIME error
app.use('/public', express.static('public'));
// express.urlencoded ({extended:true}) allows req.body to be taken from forms with POST 
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://red4cted25:OnQpump600mL$!@eventquest.2hb5c.mongodb.net/?retryWrites=true&w=majority&appName=EventQuest')

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
app.get('/events', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 }); // Sorts ascending
        res.render('pages/events', {
            pageTitle: 'Events',
            events,
            customStylesheet: '/public/css/events.css'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// ! Register page
app.get('/register/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const selectedEvent = await Event.findById(eventId); // Get the selected event from MongoDB
        if (!selectedEvent) {
            return res.status(404).send('Event not found');
        }

        const events = await Event.find(); // Get all events 

        res.render('pages/register', {
            pageTitle: `Register For ${selectedEvent.name}`,
            events,
            selectedEvent,
            selectedEventId: eventId,
            customStylesheet: '/public/css/register.css' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// POST route to handle registration
app.post('/register', async (req, res) => {
    try {
        const newRegistration = new Registration({
            personId: newId(await Registration.find(), 'personId'), // Generate a new unique personID
            name: req.body.personName,
            email: req.body.email,
            date: newDate(),
            eventId: req.body.eventId
        });

        await newRegistration.save(); // Save the registration to MongoDB

        // Update attendees for the event
        await Event.findByIdAndUpdate(req.body.eventId, { $inc: { attendees: 1 } });

        res.redirect('/register/' + req.body.eventId + '?success=true');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// ! Admin Pages
app.get('/admin', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
    res.render('pages/admin/dashboard', {
        pageTitle: 'Admin',
        events,
        customStylesheet: '/public/css/dashboard.css'
    })
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
})

// Admin Delete
app.post('/admin/delete/:id', async (req, res) => {
    try {
        // Use Mongoose to find and delete the event by ID
        await Event.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).send('Server Error');
    }
})

// Admin Edit
app.get('/admin/edit/:id', async (req, res) => {
    try {
        // Fetch the event by ID
        const event = await Event.findById(req.params.id);
        // Fetch registrations for the event
        const registrations = await Registration.find({ eventId: req.params.id });

        if (!event) {
            return res.status(404).send('Event not found');
        }
        // Render the edit event page
        res.render('pages/admin/edit-event', {
            pageTitle: `Edit ${event.name}`,
            event,
            registrations,
            customStylesheet: '/public/css/admin-event.css'
        });
    } catch (error) {
        console.error('Error fetching event or registrations:', error);
        res.status(500).send('Server Error');
    }
});

// Admin Edit - Attendees Delete
app.post('/admin/edit/delete/:personId', async (req, res) => {
    try {
        const eventId = req.body.eventId;

        // Delete the registration using the personId
        await Registration.findOneAndDelete({ personId: req.params.personId });

        // Update the attendees count for the event
        await Event.findByIdAndUpdate(eventId, { $inc: { attendees: -1 } });

        res.redirect('/admin/edit/' + eventId);
    } catch (error) {
        console.error('Error deleting registration:', error);
        res.status(500).send('Server Error');
    }
});

// Admin Edit - POST
app.post('/admin/edit/:id', async (req, res) => {
    try {
        // Update the event in the database
        await Event.findByIdAndUpdate(req.params.id, {
            description: req.body.description,
            name: req.body.name,
            date: req.body.date
        });
        res.redirect('/admin');
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).send('Server Error');
    }
});

// Admin Add
app.get('/admin/add', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.render('pages/admin/add-event', { 
            pageTitle: 'Add Event',
            events,
            customStylesheet: '/public/css/admin-event.css'
        });
    } catch (error) {
        console.error('Error deleting registration:', error);
        res.status(500).send('Server Error');
    }
})

// Admin Add - POST
app.post('/admin/add', async (req, res) => {
    try {
        const newEvent = new Event({
            name: req.body.name,
            date: req.body.date,
            capacity: parseInt(req.body.capacity),
            location: req.body.location,
            description: req.body.description,
            attendees: 0
        });

        // Save the new event to the database
        await newEvent.save();

        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while adding the event.");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})

// ! FUNCTIONS
// Function to generate a new unique ID
function newId(jsonData, idField) {
    let newId = jsonData.length + 1;
    while (jsonData.some(item => item[idField] == newId)) {
        newId++;
    }
    return newId; 
}