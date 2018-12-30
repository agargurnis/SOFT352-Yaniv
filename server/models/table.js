const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create User Schema
const TableSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    players: [String],
    started: {
        type: Boolean,
        required: true
    }
});

module.exports = Table = mongoose.model('tables', TableSchema);