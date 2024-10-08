import React, { useState, useEffect, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { REQUEST_EVENT_GET, REQUEST_EVENT_UPDATE, REQUEST_DELETE_EVENT } from '../../requests/event';
import { LOGIN, EVENT_CREATE } from '../../dist/routes';
import Authentication from '../../helpers/auth';
import '../../styles/event-list.css';


const LoadingSpinner = () => {
    return (
        <div 
            className="d-flex justify-content-center align-items-center" 
            style={{ 
                width: '100vw', 
                height: '100vh', 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                zIndex: 9999
            }} 
            role="status"
        >
            <div className="spinner-border" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};



const EventList = () => {
    const [events, setEvents] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingUpdate, setLoadingUpdate] = useState(false); // New loading state for updates
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [editableEvent, setEditableEvent] = useState(null);
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState('');
    const [updatedLocation, setUpdatedLocation] = useState('');
    const [updatedStartDate, setUpdatedStartDate] = useState('');
    const [updatedEndDate, setUpdatedEndDate] = useState('');
    const [role, setRole] = useState(null);
    const history = useHistory();

    const fetchEvents = useCallback(() => {
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
    }, []);

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
    }, [role, fetchEvents]);

    const updateEvent = async (id, formData) => {
        setLoadingUpdate(true); // Start loading update
        try {
            REQUEST_EVENT_UPDATE(id, formData, (err, res) => {
                setLoadingUpdate(false); // Stop loading update
                if (err) {
                    setErrorMessage('Could not update event.');
                    return;
                }
                const body = res.body;
                if (body.success) {
                    setSuccessMessage('Event updated successfully!');
                    fetchEvents(); // Fetch updated events
                    setEditableEvent(null);
                } else {
                    setErrorMessage(body.message || 'Error updating event.');
                }
            });
        } catch (err) {
            setLoadingUpdate(false); // Stop loading update on error
            setErrorMessage('Could not update event.');
        }
    };

    const handleEditClick = (event) => {
        setEditableEvent(event);
        setUpdatedTitle(event.title);
        setUpdatedDescription(event.description);
        setUpdatedLocation(event.location);
        setUpdatedStartDate(event.startDate);
        setUpdatedEndDate(event.endDate);
        setSelectedImage(null); // Reset selected image when editing an event
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            REQUEST_DELETE_EVENT(id, (err, res) => {
                if (err) {
                    setErrorMessage('Could not delete event.');
                    return;
                }

                const body = res.body;

                if (body.success) {
                    setSuccessMessage('Event deleted successfully!');
                    fetchEvents();
                } else {
                    setErrorMessage(body.message || 'Error deleting event.');
                    setErrors(body.extras || {});
                }
            });
        }
    };

    const renderError = () => errorMessage ? <div className="alert alert-danger">{errorMessage}</div> : null;
    const renderSuccess = () => successMessage ? <div className="alert alert-success">{successMessage}</div> : null;
    const renderFieldError = (field) => errors[field] ? <div className="alert alert-warning">{errors[field]}</div> : null;

    return (
        <div className="container mt-4 event-list-container">
            <h2 className="text-center mb-4">Event List</h2>
            <p className="text-center mb-4">Here are all the events</p>

            {role === 'admin' && (
                <Link to={EVENT_CREATE} className="btn btn-dark mb-3">Create New Event</Link>
            )}

            {(loading || loadingUpdate) && <LoadingSpinner />} {/* Show spinner when loading events or updating */}

            {renderError()}
            {renderSuccess()}

            {!loading && !errorMessage && (
                <div className="list-group">
                    {events.map(event => (
                        <div key={event._id} className="list-group-item list-group-item-action event-item">
                            <div className="d-flex align-items-start">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="img-thumbnail me-3 event-image"
                                    style={{ maxWidth: '200px' }}
                                />
                                <div className="flex-grow-1 text-dark" style={{ marginLeft: '30px', marginTop: "20px" }}>
                                    <h5 className="text-dark mb-2">{event.title}</h5>
                                    <p className="text-dark mb-2">{event.description}</p>
                                    <small className="text-dark h6">
                                        <strong>Location:</strong> {event.location} <br />
                                        <strong>Dates:</strong> {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                                    </small>
                                </div>
                                {role === 'admin' && (
                                    <div className="d-flex">
                                        <button
                                            className="btn btn-outline-primary text-dark btn-sm me-2"
                                            onClick={() => handleEditClick(event)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-outline-danger text-dark btn-sm"
                                            onClick={() => handleDelete(event._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
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
                    <form onSubmit={async (e) => {
                        e.preventDefault();

                        // Create a FormData object
                        const formData = new FormData();
                        formData.append('title', updatedTitle);
                        formData.append('description', updatedDescription);
                        formData.append('location', updatedLocation);
                        formData.append('startDate', updatedStartDate);
                        formData.append('endDate', updatedEndDate);

                        // Append the image file if it exists
                        if (selectedImage) {
                            formData.append('image', selectedImage);
                        }

                        await updateEvent(editableEvent._id, formData);
                    }}>
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
                        <div className="mb-3">
                            <label className="form-label">Upload Image</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={(e) => setSelectedImage(e.target.files[0])}
                            />
                        </div>
                        <button type="submit" className="btn btn-outline-primary btn-sm me-2">Update Event</button>
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
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
