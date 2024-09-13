var express = require('express')
var app = express()
const fs = require('fs')
const PORT = 5000
const expressLayouts = require('express-ejs-layouts');

// Middleware
app.use(expressLayouts);
app.set('layout', 'layouts/main');
// express.static
app.use('/public', express.static('public'));

// Set the view engine to ejs
app.set('view engine', 'ejs')

// Read data from a JSON file
let data = fs.readFileSync('data/events.json');
let jsonData = JSON.parse(data)

// Index page
app.get('/', (req, res) => {
    res.render('pages/index', {
        events: jsonData
    })
})

// // Read data from a JSON file
// let data = fs.readFileSync('/data/json');
// let jsonData = JSON.parse(data)

// console.log(jsonData)

// // Write data to a JSON file
// let testEvent = {
//     name: "testEvent", attendees: 25, type:"outdoor party"
// }

// // Convert object to JSON string
// let newJsonData = JSON.stringify(testEvent, null, 2)

// //Write the JSON data to a file
// fs.writeFileSync('/data/json', newJsonData)


// register page
// app.get('/register', (req, res) => {
//     res.render('pages/register', {
//         events: events,
//     })
// })

// admin pages
// app.get('/admin', (req, res) => {
//     res.render('pages/admin', {
//         events: events,
//     })
// })

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})