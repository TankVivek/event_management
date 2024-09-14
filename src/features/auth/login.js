import React, { Component } from 'react';
import { HOME, REGISTRATION } from '../../dist/routes';
import { Redirect, Link } from 'react-router-dom';
import Controller from '../controller';
import { REQUEST_LOGIN } from '../../requests/account';
import Authentication from '../../helpers/auth';
import '../../styles/common-styles.css'; // Import your CSS file

export default class LoginPage extends Controller {
    state = {
        loading: false,
        errors: {},
        successMessage: "", // Message to display after successful login
        errorMessage: "",
        loginSuccess: false,
    };

    setError = (message) => {
        this.setState({ errorMessage: message });
    };

    setFieldErrors = (errors) => {
        this.setState({ errors });
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

    submitLogin = (e) => {
        e.preventDefault();
        this.setState({ loading: true, errorMessage: "", successMessage: "" });

        const email = this.refs.email.value;
        const password = this.refs.password.value;

        REQUEST_LOGIN({ email, password }, (err, res) => {
            this.setState({ loading: false });

            if (err) {
                this.setError("Could not connect to the internet: " + err.message);
                return;
            }

            if (res.success) {
                const { token } = res;
                (new Authentication()).setApiKey(token);
                this.props.onLogin();
                this.setState({ 
                    loginSuccess: true, 
                    successMessage: "Login successful!"  // Show success message
                });

            } else {
                this.setError(res.message);
                this.setFieldErrors(res.extras || {});
            }
        });
    };

    render() {
        if (this.state.loginSuccess) {
            return <Redirect to={{ pathname: HOME }} />;
        }

        const { loading } = this.state;

        return (
            <div className="page-container">
                <main className="main-content">
                    <div className="content-wrapper">
                        <div className="text-content">
                            <h2>Login</h2>
                            <p>Manage your events seamlessly by logging in</p>
                        </div>
                        <form onSubmit={this.submitLogin} className="form">
                            {this.renderError()}
                            {this.renderSuccess()} {/* This will show success message */}
                            <div className="form-group">
                                <input ref="email" type="text" placeholder="Email" required />
                                {this.renderFieldError('email')}
                            </div>
                            <div className="form-group">
                                <input ref="password" type="password" placeholder="Password" required />
                                {this.renderFieldError('password')}
                            </div>
                            <button className="btn btn-primary" disabled={loading}>
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>
                        <Link to={REGISTRATION} className="alt-link">Not registered? Register here!</Link>
                    </div>
                </main>
                <footer className="app-footer">
                    {/* Add footer content here */}
                </footer>
            </div>
        );
    }
}
