import React from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/booking-confim.css';

const BookingConfim = () => {
    const location = useLocation();
    const { bookingDetails } = location.state || {};

    return (
        <div className="booking-confirmation-container">
            <div className="booking-confirmation-content">
                <h2 className="booking-confirmation-header">Booking Confirmation</h2>
                <div className="booking-confirmation-body">
                <h4>Thank you for booking a slot with us!</h4>
                    {bookingDetails ? (
                        <div className="booking-details">
                            <p>Your booking for {bookingDetails.seatsCount} seat has been confirmed.</p>
                        </div>
                    ) : (
                        <p>We could not find your booking details. Please try again.</p>
                    )}
                </div>
                <div className="booking-confirmation-footer">
                    <button onClick={() => window.location.href = '/'}>Go to Homepage</button>
                </div>
            </div>
        </div>
    );
};

export default BookingConfim;
