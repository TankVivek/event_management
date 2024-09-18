import React, { useState, useEffect } from 'react';
import { REQUEST_USER_BOOKING } from '../../requests/event'; // Adjust as necessary
import Modal from 'react-bootstrap/Modal'; // Make sure to install react-bootstrap

const UserBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showThankYouModal, setShowThankYouModal] = useState(false);

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
                if (body.data.length > 0 && body.data[body.data.length - 1].status === 'confirmed') {
                    setShowThankYouModal(true);
                }
            } else {
                setErrorMessage('Failed to fetch bookings');
            }
        } catch (err) {
            setErrorMessage('Error fetching bookings: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => setShowThankYouModal(false);

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

            <Modal show={showThankYouModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Thank You for Booking!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Thank you for booking our slot. We look forward to seeing you at the event!</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={handleCloseModal}>Close</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserBookingsPage;