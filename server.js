var express = require('express')
var app = express()
const fs = require('fs')
const PORT = 5000
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts');

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
app.get('/register', (req, res) => {
    const selectedEventId = req.query.event; // Get event ID from query parameter => /register?event=123456789
    let events = getEvents()
    const selectedEvent = events.find(item => item.id === selectedEventId)
    res.render('pages/register', {
        events: events,
        selectedEvent,
        selectedEventId,
        customStylesheet: '/public/css/register.css'
    });
});

// POST route to handle registration
// app.post('/register', (req, res) => {
//     const newRegistration = {
//         name: req.body.name,
//         email: req.body.email,
//         eventId: req.body.eventId
//     };
//     fs.readFile('data/registrations.json', 'utf8', (err, data) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).send('Error reading events data');
//         }
//         if (err && err.code === 'ENOENT') {
//             // If the file doesn't exist, initialize an empty array
//             let registrations = [];
//         } else {
//             const registrations = JSON.stringify(data);
//             const parseRegistrations = JSON.parse(registrations);
//             parseRegistrations.push(newRegistration);
//             fs.writeFile('data/registrations.json', JSON.stringify(registrations, null, 2), (err) => {
//                 if (err) {
//                     console.error(err);
//                     return res.status(500).send('Error writing registration data');
//                 }
//                 registerRedirect(req.body.eventId);
//             });
//         }
//     })
// });

// admin pages
// app.get('/admin', (req, res) => {
//     res.render('pages/admin', {
//         events: events,
//     })
// })

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})

// Date formatter
function formatDate() {
    const newDate = new Date().toISOString().slice(0, 10);
    const formattedDate = newDate.split('-');

    const mmddyyyy = `${formattedDate[1]}/${formattedDate[2]}/${formattedDate[0]}`;
    console.log(mmddyyyy);
}

// Function to get events from events.json
function getEvents() {
    let data = fs.readFileSync('data/events.json');
    let jsonData = JSON.parse(data)
    return jsonData
}

// Function to handle redirect for register post
function registerRedirect(eventId) {
    res.redirect('/events?success=true')
    events = getEvents();
    const selectedEvent = events.find(item => item.id === eventId)
    selectedEvent.attendees++
}