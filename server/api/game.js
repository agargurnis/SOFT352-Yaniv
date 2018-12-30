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
                status: 'table for this user already exists'
            });
        } else {
            const newTable = new Table({
                name: req.body.name,
                players: [req.body.username],
                started: false
            });

            newTable.save()
                .then(table => res.json(table))
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
                    status: 'table not found'
                });
            }
            // get current number of players 
            currentNr = table.players.length;
            // Check if the table is full
            if (currentNr < 4) {
                // update table
                table.players.push(req.body.username);
                // save to db
                table.save().then(updatedTable => res.json(updatedTable));
            } else {
                return res.status(404).json({
                    status: 'table is full'
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
                status: 'table not found'
            });
        }
        // get current number of players 
        currentNr = table.players.length;
        // Check if the table is full
        if (currentNr > 1) {
            playerIndex = table.players.indexOf(req.body.username);
            // update table
            table.players.splice(playerIndex, 1);
            // save to db
            table.save().then(updatedTable => res.json({
                status: 'successfuly left the table'
            }));
        } else if (currentNr == 1) {
            table.remove().then(() => {
                res.json({
                    status: 'successfuly deleted the table'
                });
            });
        } else {
            return res.status(404).json({
                status: 'leaving the table was unsuccessful'
            });
        }
    });
});

// POST api/game/delete
router.post('/delete', (req, res) => {
    // Find table by name
    Table.findOne({
            name: req.body.name
        }).then(table => {
            // Check for table
            if (!table) {
                return res.status(404).json({
                    status: 'table not found'
                });
            }
            // delete table from database
            table.remove().then(() => {
                res.json({
                    status: 'successfuly deleted the table'
                });
            });
        })
        .catch(error => res.status(404).json({
            status: 'no tables found'
        }));
});

// POST api/game/start
router.post('/start', (req, res) => {
    // Find table by name
    Table.findOne({
            name: req.body.tableName
        }).then(table => {
            // Check for table
            if (!table) {
                return res.status(404).json({
                    status: 'table not found'
                });
            }
            // start the game
            table.started = true;
            // save it to the database
            table.save().then(updatedTable => res.json({
                    status: 'game successfully started'
                }))
                .catch(error => res.status(400).json({
                    status: 'unable to start game'
                }))
        })
        .catch(error => res.status(404).json({
            status: 'no tables found'
        }));
})

// GET api/game
router.get('/', (req, res) => {
    Table.find()
        .then(games => {
            if (!games) {
                return res.status(404).json({
                    status: 'no tables found'
                });
            }
            res.json(games);
        })
        .catch(error => res.status(404).json({
            status: 'no tables found'
        }));
});

module.exports = router;