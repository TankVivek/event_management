import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LOGIN, EVENT_CREATE, VIEW_EVENTS, EVENT_BOOKING_GET } from '../../dist/routes'; // Add the new route for event booking
import Authentication from '../../helpers/auth';
import '../../styles/mainpage.css'; // Import your new CSS file

const MainPage = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [role, setRole] = useState(null); // State to store the user role

    useEffect(() => {
        const auth = new Authentication();
        const isLoggedIn = auth.isUserLoggedIn();
        setLoggedIn(isLoggedIn);
        
        if (isLoggedIn) {
            const userRole = localStorage.getItem('role');
            console.log('User Role from localStorage:', userRole);
            setRole(userRole);
        }
    }, []);
    
    // Only render after role is determined
    if (role === null && loggedIn) {
        return <div>Loading...</div>;
    }
    
    return (
        <div className="main-container">
            <main className="main-content">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center mb-4 mb-md-0">
                            <img 
                                src="https://img.freepik.com/premium-vector/event-management-wedding-planner-manager-planning-event-conference-party_501813-2157.jpg" 
                                alt="Event Management Illustration" 
                            />
                        </div>
                        <div className="col-md-6">
                            <h2 className="display-4 mb-4">Manage Your Events</h2>
                            <p className="lead mb-4">Streamline your event planning and execution with our powerful tools.</p>
                            <div className="d-flex flex-wrap" style={{ gap: '2rem', marginTop: "100px" }}>
                                {/* Link to View Events, only accessible if logged in */}
                                <Link to={loggedIn ? VIEW_EVENTS : LOGIN} className="btn btn-primary btn-lg">View Events</Link>

                                {/* Show Create Event button only if the user role is Admin */}
                                {role === 'admin' && (
                                    <Link to={EVENT_CREATE} className="btn btn-secondary btn-lg">Create Event</Link>
                                )}

                                {/* Show Event Booking link only if the user is logged in */}
                                {role === 'user' && (
                                    <Link to={EVENT_BOOKING_GET} className="btn btn-info btn-lg">Event Booking</Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="footer">
                <div className="container">
                    <div className="col-md-4">
                        <h5>About Us</h5>
                        <p>We provide cutting-edge event management solutions to make your events memorable.</p>
                    </div>
                    <div className="col-md-4">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="/home" className="text-white">Home</a></li>
                            <li><a href="/home" className="text-white">Features</a></li>
                            <li><a href="/home" className="text-white">Pricing</a></li>
                            <li><a href="/home" className="text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5>Contact Us</h5>
                        <p>Email: info@eventmanagement.com<br />Phone: (123) 456-7890</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainPage;
