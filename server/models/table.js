const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create User Schema
const TableSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    nrOfPlayers: {
        type: Number,
        required: true
    },
    started: {
        type: Boolean,
        required: true
    }
});

module.exports = Table = mongoose.model('tables', TableSchema);