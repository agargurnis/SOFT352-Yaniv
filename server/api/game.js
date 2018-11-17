const express = require('express');
const router = express.Router();

// Load user module
const Table = require('../models/Table');

// GET api/game/create
router.post('/create', (req, res) => {

    Table.findOne({
        name: req.body.name
    }).then(table => {
        if (table) {
            return res.status(400).json({
                success: false
            });
        } else {
            const newTable = new Table({
                name: req.body.ename,
                nrOfPlayers: req.body.nrOfPlayers
            });

            newTable.save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
        }
    });
});

// GET api/game/join
router.post('/join', (req, res) => {
    const name = req.body.name;
    // const nrOfPlayers = req.body.nrOfPlayers;

    // Find table by name
    Table.findOne({
        name: name
    }).then(table => {
        // Check for table
        if (!table) {
            return res.status(404).json({
                success: false
            });
        }
        // Check if the table is full
        if (table.nrOfPlayers < 4) {
            return res.status(200).json({
                success: true
            });
        } else {
            return res.status(404).json({
                success: false
            });
        }
    });
});

module.exports = router;