import React from 'react';
import { HOME, REGISTRATION, LOGIN } from '../../dist/routes';
import { Link } from 'react-router-dom';
import { REQUEST_REGISTER } from '../../requests/account';
import Controller from '../controller';
import '../../styles/common-styles.css'; // Import your new CSS file

export default class RegistrationPage extends Controller {
    state = {
        loading: false,
        errors: {},
        successMessage: "",
        errorMessage: ""
    };

    setError = (message) => {
        this.setState({ errorMessage: message });
    };

    setFieldErrors = (errors) => {
        this.setState({ errors });
    };

    setSuccess = (message) => {
        this.setState({ successMessage: message });
    };

    renderError = () => {
        if (this.state.errorMessage) {
            return <div className="error-message">{this.state.errorMessage}</div>;
        }
        return null;
    };

    renderSuccess = () => {
        if (this.state.successMessage) {
            return <div className="success-message">{this.state.successMessage}</div>;
        }
        return null;
    };

    renderFieldError = (field) => {
        if (this.state.errors[field]) {
            return <div className="field-error">{this.state.errors[field]}</div>;
        }
        return null;
    };

    registerUser = (e) => {
        e.preventDefault();
        this.setState({ loading: true, errorMessage: "", successMessage: "" });
    
        const firstName = this.refs.firstName.value;
        const lastName = this.refs.lastName.value;
        const email = this.refs.email.value;
        const password = this.refs.password.value;
        REQUEST_REGISTER({ firstName, lastName, email, password }, (err, res) => {
            this.setState({ loading: false });
        
            if (err) {
                console.error("API Error:", err.message);
                this.setError("Could not connect to the internet: " + err.message);
                return;
            }
        
            console.log("API Response:", res);
        
            if (res && res.success) {
                this.refs.firstName.value = '';
                this.refs.lastName.value = '';
                this.refs.email.value = '';
                this.refs.password.value = '';
                this.setSuccess(res.message || "Registration successful! You can now log in.");
                this.setError("");
                this.setFieldErrors({});
            } else {
                console.error("API Response Error:", res?.message || "Unknown error occurred");
                this.setError(res?.message || "An error occurred during registration.");
                this.setFieldErrors(res?.extras || {});
            }
        });
        
        
    };
    

    render() {
        const { loading } = this.state;

        return (
            <div className="page-container">
       
                <main className="main-content">
                    <div className="content-wrapper">
                        <div className="text-content">
                            <h2>Register</h2>
                            <p>Join us to manage your events seamlessly</p>
                        </div>
                        <form onSubmit={this.registerUser} className="form">
                            {this.renderError()}
                            {this.renderSuccess()}
                            <div className="form-group">
                                <input ref="firstName" type="text" placeholder="First Name" required />
                                {this.renderFieldError('firstName')}
                            </div>
                            <div className="form-group">
                                <input ref="lastName" type="text" placeholder="Last Name" required />
                                {this.renderFieldError('lastName')}
                            </div>
                            <div className="form-group">
                                <input ref="email" type="email" placeholder="Email" required />
                                {this.renderFieldError('email')}
                            </div>
                            <div className="form-group">
                                <input ref="password" type="password" placeholder="Password" required />
                                {this.renderFieldError('password')}
                            </div>
                            <button className="btn btn-primary" disabled={loading}>
                                {loading ? "Registering..." : "Register"}
                            </button>
                        </form>
                        <Link to={LOGIN} className="alt-link">Already registered? Login here!</Link>
                    </div>
                </main>
                <footer className="app-footer">
                    {/* Add footer content here */}
                </footer>
            </div>
        );
    }
}
