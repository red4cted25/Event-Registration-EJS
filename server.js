var express = require('express')
var app = express()
const PORT = 5000

// Set the view engine to ejs
app.set('view engine', 'ejs')

// use res.render to load up an ejs view file
// index page
// app.get('/', (req, res) => {
//     res.render('pages/index', {
//         events: events,
//     })
// })

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