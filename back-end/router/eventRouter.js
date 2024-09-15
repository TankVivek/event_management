const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const { createEvents, listEvents, updateEvent } = require('../controller/createEventController');
const { verifyAdmin, VerifyToken } = require('../utils/helper');

router.post('/create-events', upload.single('image'), verifyAdmin, createEvents);
router.put('/update-events/:id', verifyAdmin, updateEvent);

router.get('/list-events', VerifyToken, listEvents);


module.exports = router;
