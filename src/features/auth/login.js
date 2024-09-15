import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { HOME, REGISTRATION } from '../../dist/routes';
import { REQUEST_LOGIN } from '../../requests/account';
import Authentication from '../../helpers/auth';
import '../../styles/common-styles.css';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);

    const renderError = () => {
        if (errorMessage) {
            return <div className="error-message">{errorMessage}</div>;
        }
        return null;
    };

    const renderSuccess = () => {
        if (successMessage) {
            return <div className="success-message">{successMessage}</div>;
        }
        return null;
    };

    const renderFieldError = (field) => {
        if (errors[field]) {
            return <div className="field-error">{errors[field]}</div>;
        }
        return null;
    };
    const submitLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
    
        REQUEST_LOGIN({ email, password }, (err, response) => {
            setLoading(false);
    
            if (err) {
                setErrorMessage('Could not connect to the internet: ' + err.message);
                return;
            }
    
            if (response.success) {
                const { token, data} = response;
                const auth = new Authentication();
                auth.setApiKey(token);
                auth.setUserRole((data.role || '').toLowerCase());
                console.log(data._id);
                
                auth.setUserId(data._id || '');

                onLogin();
                setLoginSuccess(true);
                setSuccessMessage('Login successful!');
            } else {
                setErrorMessage(response.message);
                setErrors(response.extras || {});
            }
        });
    };
    

    if (loginSuccess) {
        return <Redirect to={{ pathname: HOME }} />;
    }

    return (
        <div className="page-container">
            <main className="main-content">
                <div className="content-wrapper">
                    <div className="text-content">
                        <h2>Login</h2>
                        <p>Manage your events seamlessly by logging in</p>
                    </div>
                    <form onSubmit={submitLogin} className="form">
                        {renderError()}
                        {renderSuccess()}
                        <div className="form-group">
                            <input 
                                type="text" 
                                placeholder="Email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                            {renderFieldError('email')}
                        </div>
                        <div className="form-group">
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                            {renderFieldError('password')}
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
};

export default LoginPage;
