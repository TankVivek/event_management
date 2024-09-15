import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { REQUEST_EVENT_GET, REQUEST_EVENT_UPDATE } from '../../requests/event';
import { LOGIN, EVENT_CREATE } from '../../dist/routes';
import Authentication from '../../helpers/auth';
import '../../styles/event-list.css';  // Import custom CSS for additional styling

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [editableEvent, setEditableEvent] = useState(null);
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState('');
    const [updatedLocation, setUpdatedLocation] = useState('');
    const [updatedStartDate, setUpdatedStartDate] = useState('');
    const [updatedEndDate, setUpdatedEndDate] = useState('');
    const [role, setRole] = useState(null);  // Add role state
    const history = useHistory();

    useEffect(() => {
        const auth = new Authentication();
        if (!auth.isUserLoggedIn()) {
            history.push(LOGIN);
        } else {
            const userRole = localStorage.getItem('role');
            if (userRole) {
                setRole(userRole); // Get the role from localStorage
                console.log('User Role from localStorage:', userRole);
            } else {
                setRole(null);  // Default to null if not available
            }
        }
    }, [history]);

    useEffect(() => {
        // Fetch events only if the role is not null
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
                fetchEvents(); // Refresh events list
                setEditableEvent(null); // Hide update form
            } else {
                setErrorMessage(body.message || 'Error updating event.');
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

    const renderError = () => {
        if (errorMessage) {
            return <div className="alert alert-danger">{errorMessage}</div>;
        }
        return null;
    };

    const renderSuccess = () => {
        if (successMessage) {
            return <div className="alert alert-success">{successMessage}</div>;
        }
        return null;
    };

    const renderFieldError = (field) => {
        if (errors[field]) {
            return <div className="alert alert-warning">{errors[field]}</div>;
        }
        return null;
    };

    const renderLoading = () => {
        if (loading) {
            return <div className="alert alert-info">Loading...</div>;
        }
        return null;
    };

    return (
        <div className="container mt-4 event-list-container">
            <h2 className="text-center mb-4">Event List</h2>
            <p className="text-center mb-4">Here are all the events</p>

            {/* Show "Create New Event" button only if the user role is 'Admin' */}
            {role === 'admin' && (
                <Link to={EVENT_CREATE} className="btn btn-primary mb-3">Create New Event</Link>
            )}

            {renderLoading()}
            {renderError()}
            {renderSuccess()}

            {!loading && !errorMessage && (
                <div className="list-group">
                    {events.map(event => (
                        <div key={event._id} className="list-group-item list-group-item-action event-item">
                            <div className="d-flex w-100 justify-content-between align-items-center">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="img-thumbnail me-3 event-image"
                                    style={{ maxWidth: '150px' }}
                                />
                                <div className="d-flex flex-column">
                                    <h5 className="mb-1">{event.title}</h5>
                                    <p className="mb-1">{event.description}</p>
                                    <small className="text-muted">
                                        Location: {event.location} <br />
                                        Dates: {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                                    </small>
                                </div>
                                {/* Allow editing only if user is 'Admin' */}
                                {role === 'admin' && (
                                    <button
                                        className="btn btn-warning ms-3"
                                        onClick={() => handleEditClick(event)}
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                            {renderFieldError('event')}
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
                                value={updatedStartDate.split('T')[0]} // Format date
                                onChange={(e) => setUpdatedStartDate(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={updatedEndDate.split('T')[0]} // Format date
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
        </div>
    );
};

export default EventList;
