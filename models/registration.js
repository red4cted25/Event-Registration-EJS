const mongoose = require('mongoose');

// Define the Registration schema
const registrationSchema = new mongoose.Schema({
    personId: {
        type: Number,
        required: true,
        unique: true // Ensure each personId is unique
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/ // Basic email validation
    },
    date: {
        type: Date,
        default: Date.now // Automatically set the date to now if not provided
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event', // Reference to the Event model
        required: true
    }
});

// Create the Registration model
const Registration = mongoose.model('Registration', registrationSchema);


module.exports = Registration;