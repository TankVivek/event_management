import React, { useState, useEffect } from 'react';
import { REQUEST_USER_BOOKING } from '../../requests/event'; // Adjust as necessary

const UserBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchUserBookings();
    }, []);

    const fetchUserBookings = async () => {
        setLoading(true);
        try {
            const res = await REQUEST_USER_BOOKING();
            const body = res.body;
            if (body.success) {
                setBookings(body.data);
            } else {
                setErrorMessage('Failed to fetch bookings');
            }
        } catch (err) {
            setErrorMessage('Error fetching bookings: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h2>Your Booked Events</h2>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {loading && <div className="loading-message">Loading...</div>}
            <div className="bookings-list">
                {bookings.map((booking) => (
                    <div key={booking._id} className="booking-item">
                        <h3>{booking.event.title}</h3>
                        <p>Status: {booking.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserBookingsPage;
