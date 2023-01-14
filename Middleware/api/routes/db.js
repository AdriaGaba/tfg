const express = require('express');
const router = express.Router();

const {getActiveProjectsByDate} = require ('../controllers/controllerProjectes');

router.route('/projects/date').get(getActiveProjectsByDate);

module.exports = router;