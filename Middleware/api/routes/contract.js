const express = require('express');
const router = express.Router();
const {getContractTransactions} = require ('../controllers/contract.js'); // gaba: ho he canviat per la ruta de contract.js de controllers

router.route('/blockchain/transactions').get(getContractTransactions);

module.exports = router;