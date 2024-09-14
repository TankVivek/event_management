import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { HOME, LOGOUT, LOGIN } from '../dist/routes';

export default class Header extends Component {

    state = {
        loggedIn: false
    };

    constructor(props) {
        super(props);
        this.state.loggedIn = props.loggedIn;
    }

    componentWillReceiveProps({ loggedIn }) {
        if (loggedIn !== this.state.loggedIn)
            this.setState({ loggedIn });
    }

    renderLogout = () => {
        if (this.state.loggedIn)
            return (
                <Link to={LOGOUT}>
                    <button className="btn btn-danger">Logout</button>
                </Link>
            );
    };

    render() {
        return (
            <header className="header">
                <div className="container">
                    <div className="d-flex align-items-center">
                        <header style={{
                            display: 'flex',
                            justifyContent: 'center', /* Center horizontally */
                            alignItems: 'center', /* Center vertically */
                            padding: '1rem',
                        }}>
                            <h1 style={{
                                fontSize: '1.5rem', /* Adjust font size as needed */
                                color: 'white',
                                margin: 0, /* Remove default margin */
                            }}>
                                <Link to={HOME} style={{
                                    color: 'inherit', /* Inherit color from parent h1 */
                                    textDecoration: 'none', /* Remove underline from link */
                                }}>
                                    Event Management
                                </Link>
                            </h1>
                        </header>

                    </div>
                    <div>
                        <Link to={HOME}>
                            <button className="btn btn-secondary">Events Info</button>
                        </Link>
                        <Link to={LOGIN} style={{ color: 'white' }}>
                            <button className="btn btn-primary">Login</button>
                        </Link>
                        {this.renderLogout()}
                    </div>
                </div>
            </header>
        );
    }
}
