const mongoose = require('mongoose');

// Define the Event schema
const eventSchema = new mongoose.Schema({
    name: String,
    date: Date,
    location: String,
    description: String,
    attendees: { type: Number, default: 0 }
});

// Create the Event model
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;