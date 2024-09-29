import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { REQUEST_EVENT_GET, REQUEST_EVENT_UPDATE, REQUEST_BOOKING } from '../../requests/event';
import { LOGIN, EVENT_CREATE } from '../../dist/routes';
import Authentication from '../../helpers/auth';
import '../../styles/event-list.css';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [bookingConfirmation, setBookingConfirmation] = useState('');
    const [editableEvent, setEditableEvent] = useState(null);
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState('');
    const [updatedLocation, setUpdatedLocation] = useState('');
    const [updatedStartDate, setUpdatedStartDate] = useState('');
    const [updatedEndDate, setUpdatedEndDate] = useState('');
    const [role, setRole] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [membersCount, setMembersCount] = useState('');
    const [bookingErrorMessage, setBookingErrorMessage] = useState('');
    const history = useHistory();

    useEffect(() => {
        const auth = new Authentication();
        if (!auth.isUserLoggedIn()) {
            history.push(LOGIN);
        } else {
            setRole(localStorage.getItem('role') || null);
        }
    }, [history]);

    useEffect(() => {
        if (role) {
            fetchEvents();
        }
    }, [role]);

    const fetchEvents = () => {
        setLoading(true);
        setErrorMessage('');

        REQUEST_EVENT_GET((err, res) => {
            setLoading(false);

            if (err) {
                setErrorMessage('Could not connect to the server.');
                return;
            }

            const body = res.body;

            if (body.success) {
                setEvents(body.data);
                setSuccessMessage('Events loaded successfully!');
            } else {
                setErrorMessage(body.message || 'Error fetching events.');
            }
        });
    };

    const updateEvent = (id) => {
        const updatedData = {
            title: updatedTitle,
            description: updatedDescription,
            location: updatedLocation,
            startDate: updatedStartDate,
            endDate: updatedEndDate,
        };

        REQUEST_EVENT_UPDATE(id, updatedData, (err, res) => {
            if (err) {
                setErrorMessage('Could not update event.');
                return;
            }

            const body = res.body;

            if (body.success) {
                setSuccessMessage('Event updated successfully!');
                fetchEvents();
                setEditableEvent(null);
            } else {
                setErrorMessage(body.message || 'Error updating event.');
            }
        });
    };

    const handleBooking = (eventId) => {
        setSelectedEvent(eventId);
        setShowBookingModal(true);
        setBookingErrorMessage('');
    };

    const bookEvent = () => {
        REQUEST_BOOKING(selectedEvent, membersCount, (err, res) => {
            if (err) {
                setBookingErrorMessage('Could not book event.');
                return;
            }

            const body = res.body;

            if (body.success) {
                history.push('/confirm', { bookingDetails: { seatsCount: membersCount } });
                setSuccessMessage('Event booked successfully!');
                setBookingConfirmation('Thank you for booking our slot!');
                setShowBookingModal(false);
                setMembersCount('');
            } else {
                setBookingErrorMessage(body.message || 'Error booking event.');
            }
        });
    };

    const handleEditClick = (event) => {
        setEditableEvent(event);
        setUpdatedTitle(event.title);
        setUpdatedDescription(event.description);
        setUpdatedLocation(event.location);
        setUpdatedStartDate(event.startDate);
        setUpdatedEndDate(event.endDate);
    };

    return (
        <div className="container mt-4 event-list-container" >

            <h2 className="text-center mb-4">Event List</h2>
            <p className="text-center mb-4">Here are all the events</p>

            {role === 'admin' && (
                <Link to={EVENT_CREATE} className="btn btn-primary mb-3">Create New Event</Link>
            )}

            {loading && <div className="alert alert-info">Loading...</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {bookingConfirmation && <div className="alert alert-info">{bookingConfirmation}</div>}

            {!loading && !errorMessage && (
    <div className="row-cols-1 row-cols-md-2" >
        {events.map(event => (
            <div key={event._id} className="card h-100 d-flex flex-row" style={{ width: '100%', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden',marginTop: "20px" }}>
                
            {/* Event Image */}
<img
    style={{
        margin: "10px 10px 10px 30px",
        borderRadius: "10px",
        width: "230px",   // Set your desired fixed width
        height: "220px",  // Set your desired fixed height
        objectFit: "cover" // Ensures the image covers the dimensions without distorting
    }}
    className="img-fluid"
    src={event.image}
    alt={event.title}
/>


                {/* Event Details */}
                <div className="card-body d-flex flex-column justify-content-between" style={{ paddingLeft: '50px' }}>
                    <div>
                        <h5 className="card-title h4 mb-2">{event.title}</h5>
                        <p className="card-text mb-2 h5">{event.description}</p>
                        <p className="card-text">
                            <small className="h6">
                                <strong>Location:</strong> {event.location}<br />
                                <strong>Dates:</strong> {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}<br />
                                <strong>Remaining Seats:</strong> {event.capacity - event.bookedSeats}
                            </small>
                        </p>
                    </div>
                    
                    <div className="justify-content-between align-items-center mt-3">
                        {role === 'admin' && (
                            <button
                                className="btn btn-warning"
                                onClick={() => handleEditClick(event)}
                            >
                                Edit
                            </button>
                        )}
                        {role === 'user' && (
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleBooking(event._id)}
                            >
                                Book
                            </button>
                        )}
                    </div>
                </div>

                
            </div>
        ))}
    </div>
)}



            {editableEvent && (
                <div className="mt-4">
                    <h3>Edit Event</h3>
                    <form onSubmit={(e) => { e.preventDefault(); updateEvent(editableEvent._id); }}>
                        <div className="mb-3">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                value={updatedTitle}
                                onChange={(e) => setUpdatedTitle(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                value={updatedDescription}
                                onChange={(e) => setUpdatedDescription(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Location</label>
                            <input
                                type="text"
                                className="form-control"
                                value={updatedLocation}
                                onChange={(e) => setUpdatedLocation(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={updatedStartDate.split('T')[0]}
                                onChange={(e) => setUpdatedStartDate(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={updatedEndDate.split('T')[0]}
                                onChange={(e) => setUpdatedEndDate(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Update Event</button>
                    </form>
                </div>
            )}

            {showBookingModal && (
                <div className="modal show " style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Book Event</h5>
                                <button type="button" className="btn-close" onClick={() => setShowBookingModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {bookingErrorMessage && <div className="alert alert-danger">{bookingErrorMessage}</div>}
                                <div className="mb-3">
                                    <label className="form-label">Number of Seats</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={membersCount}
                                        onChange={(e) => setMembersCount(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowBookingModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={bookEvent}>Book Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventList;
