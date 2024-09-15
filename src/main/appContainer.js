import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import MainPage from "../features/main";
import { HOME, LOGIN, REGISTRATION, EVENT_CREATE, VIEW_EVENTS, LOGOUT ,EVENT_BOOKING ,EVENT_BOOKING_GET,EVENT_BOOKING_CANCEL } from "../dist/routes";
import LoginPage from "../features/auth/login";
import RegistrationPage from "../features/auth/register";
import EventCreate from "../features/event/create";
import Authentication from "../helpers/auth";
import Header from "../layouts/header";
import EventList from '../features/event/EventList'; // Adjust this path as needed
import EventBooking from '../features/event/EventBooking'; // Adjust this path as needed


class AppContainer extends Component {
    state = {
        loggedIn: false
    };

    componentDidMount() {
        this.checkLoginStatus();
    }

    checkLoginStatus = () => {
        let loggedIn = (new Authentication()).isUserLoggedIn();
        this.setState({ loggedIn });
    };

    logoutAction = () => {
        (new Authentication()).removeApiKey();
        this.checkLoginStatus();
        return (
            <Redirect to={{
                pathname: HOME,
            }} />
        );
    };

    render() {
        return (
            <div className="app__root">
                <Header loggedIn={this.state.loggedIn} />
                <Switch>
                    <Route
                        path={HOME}
                        exact
                        render={() => <MainPage />} />
                    <Route
                        path={LOGIN}
                        exact
                        render={() => <LoginPage onLogin={this.checkLoginStatus} />} />
                    <Route
                        path={LOGOUT}
                        exact
                        render={this.logoutAction} />
                    <Route
                        path={REGISTRATION}
                        exact
                        render={() => <RegistrationPage />} />
                    <Route
                        path={VIEW_EVENTS}
                        exact
                        render={() => <EventList />} />
                             <Route
                        path={EVENT_BOOKING}
                        exact
                        render={() => <EventBooking />} />
                             <Route
                        path={EVENT_BOOKING_GET}
                        exact
                        render={() => <EventBooking />} />
                          <Route
                        path={EVENT_BOOKING_CANCEL}
                        exact
                        render={() => <EventBooking />} />   
                    <Route
                        path={EVENT_CREATE}
                        exact
                        render={() => <EventCreate />} />
                </Switch>
            </div>
        )
    }
}

export default AppContainer;