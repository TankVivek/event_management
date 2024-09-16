const Event = require('../model/eventModel');
const Booking = require('../model/eventBookingModel');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const bookEvent = async (req, res) => {
    const { eventId  , members } = req.params;
    const authorization = req.headers.authorization;
    const token = authorization && authorization.startsWith('Bearer ')
        ? authorization.slice(7, authorization.length)
        : authorization;
    const jt = jwt.verify(token, secretKey);
    try {
        const membersCount = parseInt(members, 10);
        if (isNaN(membersCount) || membersCount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid number of members',
            });
        }
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }
        if (event.bookedSeats + membersCount > event.capacity) {
            return res.status(400).json({
                success: false,
                message: 'Not enough seats available',
            });
        }
        const booking = new Booking({
            user: jt.id,
            event: eventId,
            members: membersCount,
        });
        await booking.save();
        event.bookedSeats += membersCount;
        event.bookings.push(booking._id);
        await event.save();
        res.status(201).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const userId = req.params;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required',
            });
        }
        const bookings = await Booking.find(userId).populate('event');
        if (!bookings) ({
            success: false,
            message: "booking not found",
        })

        res.status(200).json({
            success: true,
            data: bookings,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


const cancelBooking = async (req, res) => {
    const { bookingId } = req.params;
    const userId = req.user._id; // Assuming you have user authentication middleware


    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }
        if (booking.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this booking',
            });
        }
        booking.status = 'cancelled';
        await booking.save();

        const event = await Event.findById(booking.event);
        event.bookedSeats -= 1;
        event.bookings = event.bookings.filter(b => b.toString() !== bookingId);
        await event.save();

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    bookEvent,
    getUserBookings,
    cancelBooking,
};