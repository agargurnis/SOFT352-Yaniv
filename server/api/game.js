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
                name: req.body.name,
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
    // Find table by name
    Table.findById(req.body.tableId)
        .then(table => {
            // Check for table
            if (!table) {
                return res.status(404).json({
                    success: false
                });
            }
            // get current number of players 
            currentNr = table.nrOfPlayers;
            // Check if the table is full
            if (currentNr < 4) {
                // update table
                table.nrOfPlayers = currentNr + 1;
                // save to db
                table.save().then(updatedTable => res.json(updatedTable));
            } else {
                return res.status(404).json({
                    success: false
                });
            }
        });
});

// GET api/game/leave
router.post('/leave', (req, res) => {
    // Find table by name
    Table.findOne({
        name: req.body.tableName
    }).then(table => {
        // Check for table
        if (!table) {
            return res.status(404).json({
                success: false
            });
        }
        // get current number of players 
        currentNr = table.nrOfPlayers;
        // Check if the table is full
        if (currentNr > 1) {
            // update table
            table.nrOfPlayers = currentNr - 1;
            // save to db
            table.save().then(updatedTable => res.json(updatedTable));
        } else if (currentNr == 1) {
            table.remove().then(() => {
                res.json({
                    success: true
                });
            });
        } else {
            return res.status(404).json({
                success: false
            });
        }
    });
});

// GET api/game
router.get('/', (req, res) => {
    Table.find()
        .then(games => {
            if (!games) {
                return res.status(404).json({
                    success: false
                });
            }
            res.json(games);
        })
        .catch(error => res.status(404).json({
            games: 'No games found'
        }));
});

module.exports = router;