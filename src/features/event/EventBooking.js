import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HOME } from '../../dist/routes';
import { REQUEST_EVENT_GET, REQUEST_BOOKING, REQUEST_USER_BOOKING, REQUEST_CNACEL_BOOKING, EVENT_LISTING } from '../../requests/event';
import Authentication from '../../helpers/auth';
import '../../styles/common-styles.css';

const EventPage = () => {
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchEvents();
        fetchUserBookings();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const res = await REQUEST_EVENT_GET();
            const body = res.body;
            if (body.success) {
                setEvents(body.data);
            } else {
                setErrorMessage(body.message || 'Failed to fetch events');
            }
        } catch (err) {
            setErrorMessage('Error fetching events: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserBookings = async () => {
        const userId = localStorage.getItem('id');
        if (!userId) {
            setErrorMessage('User not logged in');
            return;
        }
        setLoading(true);
        setErrorMessage('');
        try {
            const res = await REQUEST_USER_BOOKING(userId);
            const body = res.body;
            if (body.success) {
                setBookings(body.data);
            } else {
                setErrorMessage(body.message || 'Failed to fetch bookings');
            }
        } catch (err) {
            setErrorMessage('Error fetching bookings: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBookEvent = async (eventId) => {
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const res = await REQUEST_BOOKING(eventId);
            const body = res.body;
            if (body.success) {
                setSuccessMessage('Booking successful!');
                fetchUserBookings();
            } else {
                setErrorMessage(body.message || 'Failed to book event');
            }
        } catch (err) {
            setErrorMessage('Error booking event: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const res = await REQUEST_CNACEL_BOOKING(bookingId);
            const body = res.body;
            if (body.success) {
                setSuccessMessage('Booking cancelled successfully!');
                fetchUserBookings();
            } else {
                setErrorMessage(body.message || 'Failed to cancel booking');
            }
        } catch (err) {
            setErrorMessage('Error canceling booking: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderError = () => {
        if (errorMessage) {
            return <div className="error-message">{errorMessage}</div>;
        }
        return null;
    };

    const renderSuccess = () => {
        if (successMessage) {
            return <div className="success-message">{successMessage}</div>;
        }
        return null;
    };

    return (
        <div className="page-container">
            <main className="main-content">
                <div className="content-wrapper">
                    <div className="text-content">
                        <h2>Events</h2>
                        <p>Browse and manage your event bookings</p>
                    </div>
                    {renderError()}
                    {renderSuccess()}

                    {/* Events List */}
                    <div className="events-list">
                        {loading && <div className="loading-message">Loading events...</div>}
                        {events.map(event => (
                            <div key={event._id} className="event-item">
                                <img src={event.image} alt={event.title} className="event-image" />
                                <h3>{event.title}</h3>
                                <p>{event.description}</p>
                                <p>Dates: {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</p>
                                <button onClick={() => handleBookEvent(event._id)} disabled={loading}>
                                    {loading ? "Booking..." : "Book Event"}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* User Bookings */}
                    <div className="user-bookings">
                        <h2>Your Bookings</h2>
                        {loading && <div className="loading-message">Loading bookings...</div>}
                        {bookings.map(booking => (
                            <div key={booking._id} className="booking-item">
                                <h3>{booking.event.title}</h3>
                                <p>Status: {booking.status}</p>
                                <button onClick={() => handleCancelBooking(booking._id)} disabled={loading}>
                                    {loading ? "Cancelling..." : "Cancel Booking"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <footer className="app-footer">
                {/* Add footer content here */}
            </footer>
        </div>
    );
};

export default EventPage;
