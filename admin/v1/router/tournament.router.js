var Tournament = require('./../controller/tournament.controller');
var express = require('express');
var router = express.Router();
// All Data
router.post('/page', Tournament.getTournament);
// Insert
router.post('/', Tournament.insertOneTournament);
// Update 
router.put('/:id', Tournament.updateOneTournament);
// Update Tournament - Cancle and Confirmed
router.put('/', Tournament.updateTournamentCancle);
// Delete 
router.delete('/:id', Tournament.deleteOneTournament);
// Insert
router.post('/round/:id', Tournament.insertOneTournamentRound);
// Update 
router.put('/round/:id', Tournament.updateOneTournamentRound);
// Delete 
router.delete('/round/:id', Tournament.deleteOneTournamentRound);
module.exports = router;