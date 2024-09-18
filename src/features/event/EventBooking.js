import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { REQUEST_EVENT_GET, REQUEST_EVENT_UPDATE, REQUEST_BOOKING } from '../../requests/event';
import { LOGIN, EVENT_CREATE } from '../../dist/routes';
import Authentication from '../../helpers/auth';
import '../../styles/event-list.css';

const EventPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [setErrors] = useState({});
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
    const history = useHistory();

    useEffect(() => {
        const auth = new Authentication();
        if (!auth.isUserLoggedIn()) {
            history.push(LOGIN);
        } else {
            const userRole = localStorage.getItem('role');
            if (userRole) {
                setRole(userRole);
            } else {
                setRole(null);
            }
        }
    }, [history]);

    useEffect(() => {
        if (role !== null) {
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
                setErrors(body.extras || {});
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
                setErrors(body.extras || {});
            }
        });
    };

    const handleBooking = (eventId) => {
        setSelectedEvent(eventId);
        setShowBookingModal(true);
    };

    const bookEvent = () => {
        REQUEST_BOOKING(selectedEvent, membersCount, (err, res) => {
            if (err) {
                setErrorMessage('Could not book event.');
                return;
            }

            const body = res.body;

            if (body.success) {
                setSuccessMessage('Event booked successfully!');
                fetchEvents(); // Refresh the events list
                setShowBookingModal(false);
                setMembersCount('');
            } else {
                setErrorMessage(body.message || 'Error booking event.');
                setErrors(body.extras || {});
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

    const renderError = () => errorMessage ? <div className="alert alert-danger">{errorMessage}</div> : null;
    const renderSuccess = () => successMessage ? <div className="alert alert-success">{successMessage}</div> : null;
    const renderLoading = () => loading ? <div className="alert alert-info">Loading...</div> : null;

    return (
        <div className="container mt-4 event-list-container">
            <h2 className="text-center mb-4">Event List</h2>
            <p className="text-center mb-4">Here are all the events</p>

            {role === 'admin' && (
                <Link to={EVENT_CREATE} className="btn btn-primary mb-3">Create New Event</Link>
            )}

            {renderLoading()}
            {renderError()}
            {renderSuccess()}

            {!loading && !errorMessage && (
                <div className="row row-cols-1 row-cols-md-2 g-4">
                    {events.map(event => (
                        <div key={event._id} className="col">
                            <div className="card h-100 w-100 event-card">
                                <img style={{ height: '350px', width: '500px' }} className="card-img-top" src={event.image} alt={event.title} />
                                <div className="card-body">
                                    <h5 className="card-title" style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
                                        {event.title}
                                    </h5>
                                    <p className="card-text" style={{ fontSize: '1.25rem' }}>
                                        {event.description}
                                    </p>
                                    <p className="card-text" style={{ fontSize: '1rem' }}>
                                        <small className="text-muted">
                                            <strong>Location:</strong> {event.location}<br />
                                            <strong>Dates:</strong> {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}<br />
                                            <strong>Remaining Seats:</strong> {event.capacity - event.bookedSeats}
                                        </small>
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center">
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
                                                className="btn btn-success"
                                                onClick={() => handleBooking(event._id)}
                                            >
                                                Book
                                            </button>
                                        )}
                                    </div>
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
                        <div className="mb-5">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                value={updatedTitle}
                                onChange={(e) => setUpdatedTitle(e.target.value)}
                            />
                        </div>
                        <div className="mb-5">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                value={updatedDescription}
                                onChange={(e) => setUpdatedDescription(e.target.value)}
                            />
                        </div>
                        <div className="mb-5">
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
                        <button
                            type="button"
                            className="btn btn-secondary ms-3"
                            onClick={() => setEditableEvent(null)}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            {/* Booking Modal */}
            {showBookingModal && selectedEvent && (
                <div className="modal-backdrop show"></div>
            )}

            {showBookingModal && selectedEvent && (
                <>
                    <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}></div>
                    <div className="modal show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Book Event</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowBookingModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p className="text-muted">
                                        Remaining Seats: <span className="fw-bold text-primary">{events.find(e => e._id === selectedEvent)?.capacity - events.find(e => e._id === selectedEvent)?.bookedSeats}</span>
                                    </p>
                                    <div className="mb-3">
                                        <label className="form-label">Number of Members</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={membersCount}
                                            onChange={(e) => setMembersCount(e.target.value)}
                                            min="1"
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowBookingModal(false)}>Close</button>
                                    <button type="button" className="btn btn-primary" onClick={bookEvent}>Confirm Booking</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default EventPage;
