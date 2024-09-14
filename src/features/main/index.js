import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LOGIN } from '../../dist/routes';
import Authentication from '../../helpers/auth';
import '../../styles/mainpage.css'; // Import your new CSS file

const MainPage = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const auth = new Authentication();
        setLoggedIn(auth.isUserLoggedIn());
    }, []);

    return (
        <div className="main-container">
   

            <main className="main-content">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center mb-4 mb-md-0">
                            <img src="https://img.freepik.com/premium-vector/event-management-wedding-planner-manager-planning-event-conference-party_501813-2157.jpg" alt="Event Management Illustration" />
                        </div>
                        <div className="col-md-6">
                            <h2 className="display-4 mb-4">Manage Your Events</h2>
                            <p className="lead mb-4">Streamline your event planning and execution with our powerful tools.</p>
                            <div className="d-flex flex-wrap" style={{ gap: '2rem', marginTop: "100px" }}>
                                <Link to={loggedIn ? LOGIN : '/login'} className="btn btn-primary btn-lg">View Events</Link>
                                <Link to={loggedIn ? LOGIN : '/login'} className="btn btn-secondary btn-lg">Create Event</Link>
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
                            <li><a href="#" className="text-white">Home</a></li>
                            <li><a href="#" className="text-white">Features</a></li>
                            <li><a href="#" className="text-white">Pricing</a></li>
                            <li><a href="#" className="text-white">Contact</a></li>
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
