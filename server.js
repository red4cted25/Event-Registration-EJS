var express = require('express')
var app = express()
const fs = require('fs')
const PORT = 5000
const expressLayouts = require('express-ejs-layouts');

// Middleware
app.use(expressLayouts);
app.set('layout', 'layouts/main');
// express.static allows css/js to be used in files without MIME error
app.use('/public', express.static('public'));
// express.urlencoded ({extended:true}) allows req.body to be taken from forms with POST 
app.use(express.urlencoded({ extended: true }));

// Set the view engine to ejs
app.set('view engine', 'ejs')

// Funtion to get events from events.json
function getEvents() {
    let data = fs.readFileSync('data/events.json');
    let jsonData = JSON.parse(data)
    return jsonData
}

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

app.post('/register', (req, res) => {
    const { name, email, eventId } = req.body; // Gets event id from key/value pairs in url
});

//Write the JSON data to a file
// fs.writeFileSync('/data/json', newJsonData)

// admin pages
// app.get('/admin', (req, res) => {
//     res.render('pages/admin', {
//         events: events,
//     })
// })

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})