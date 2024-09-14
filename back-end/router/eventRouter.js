const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const { createEvents , listEvents} = require('../controller/createEventController'); // Adjust the path as needed

router.post('/create-events',  upload.single('image') , createEvents );
router.get('/list-events', listEvents);

module.exports = router;
