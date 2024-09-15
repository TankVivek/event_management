const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const { createEvents, listEvents, updateEvent } = require('../controller/createEventController');
const { verifyAdmin, VerifyToken } = require('../utils/helper');
const { bookEvent, getUserBookings ,cancelBooking} = require('../controller/eventBookingController');


router.post('/create-events', upload.single('image'), verifyAdmin, createEvents);
router.put('/update-events/:id', verifyAdmin, updateEvent);

// view events

router.get('/list-events', VerifyToken, listEvents);

// Booking events

router.post('/events/:eventId/book', VerifyToken, bookEvent);
router.get('/bookings/:id', VerifyToken, getUserBookings);
router.put('/bookings/:bookingId/cancel', VerifyToken, cancelBooking);


module.exports = router;
