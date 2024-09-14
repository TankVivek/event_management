import React, { Component } from 'react';
import { HOME } from '../../dist/routes';
import { Redirect } from 'react-router-dom';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import { REQUEST_EVENT_CREATE } from '../../requests/event';
import { getBody } from '../../requests';
import Controller from '../controller';
import '../../styles/event-create.css'; // Custom CSS file

const formatDateDisplay = (date, defaultText) => {
    if (!date) return defaultText;
    return format(date, 'MM/DD/YYYY');
};

export default class EventCreate extends Controller {
    state = {
        address: '',
        dateRange: {
            selection: {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection',
            },
        },
        loading: false,
        errors: {},
        successMessage: "",
        errorMessage: "",
        location: {},
        image: null // State to handle image file
    };

    handleChange = address => {
        this.setState({ address });
    };

    handleSelect = address => {
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                this.setState({
                    location: {
                        lat: latLng.lat,
                        lng: latLng.lng,
                        name: address
                    },
                    address
                });
            })
            .catch(error => console.error('Error', error));
    };

    handleRangeChange = (payload) => {
        this.setState({
            dateRange: {
                ...this.state.dateRange,
                ...payload,
            },
        });
    };

    handleImageChange = (event) => {
        if (event.target.files[0]) {
            this.setState({
                image: event.target.files[0] // Store the file object
            });
        }
    };

    submitEvent = (e) => {
        e.preventDefault();
        this.loading(true);

        let title = this.refs.title.value;
        let details = this.refs.details.value;
        let location = this.state.location;
        let date = {
            start: this.state.dateRange.selection.startDate,
            end: this.state.dateRange.selection.endDate,
        };

        // Create FormData object
        let formData = new FormData();
        formData.append('title', title);
        formData.append('details', details);
        formData.append('location', JSON.stringify(location));
        formData.append('date', JSON.stringify(date));
        if (this.state.image) {
            formData.append('image', this.state.image);
        }

        REQUEST_EVENT_CREATE(formData, (err, res) => {
            this.loading(false); // Fix to stop loading
            if (err) {
                this.setError("Could not connect to the internet");
                return;
            }

            let body = getBody(res);

            if (body.status) {
                this.setSuccess(body.message);
                this.setError("");
                this.setFieldErrors({});
                return;
            }

            this.setError(body.message);
            this.setFieldErrors(body.extras);
        });
    };

    render() {
        return (
            <section className="event-create">
                <div className="container">
                    <header className="event-header">
                        <h2 className="event-title">Create Event</h2>
                        <p className="event-subtitle">Manage your events seamlessly</p>
                    </header>
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2">
                            <div className="event-form">
                                <form onSubmit={this.submitEvent}>
                                    {this.renderError()}
                                    {this.renderSuccess()}
                                    <div className="form-group">
                                        <label htmlFor="title">Event Title:</label>
                                        <input ref="title" type="text" id="title" className="form-control" />
                                        {this.renderFieldError('title')}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="details">Event Description:</label>
                                        <textarea ref="details" id="details" className="form-control" />
                                        {this.renderFieldError('details')}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="location">Location:</label>
                                        {this.renderFieldError('location')}
                                        <PlacesAutocomplete
                                            value={this.state.address}
                                            onChange={this.handleChange}
                                            onSelect={this.handleSelect}
                                        >
                                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
                                                const inputProps = getInputProps({
                                                    placeholder: 'Search Places ...',
                                                    className: 'form-control location-search-input',
                                                });

                                                return (
                                                    <div className="autocomplete-container">
                                                        <input {...inputProps} />
                                                        <div className="autocomplete-dropdown-container">
                                                            {loading && <div>Loading...</div>}
                                                            {suggestions.map(suggestion => {
                                                                const className = suggestion.active
                                                                    ? 'suggestion-item--active'
                                                                    : 'suggestion-item';
                                                                const style = suggestion.active
                                                                    ? { backgroundColor: '#6a8279', cursor: 'pointer' }
                                                                    : { backgroundColor: '#495057', cursor: 'pointer' };
                                                                return (
                                                                    <div
                                                                        {...getSuggestionItemProps(suggestion, {
                                                                            className,
                                                                            style,
                                                                        })}
                                                                    >
                                                                        <span>{suggestion.description}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            }
                                        </PlacesAutocomplete>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="date">Date:</label>
                                        {this.renderFieldError('date')}
                                        <div className="date-range-picker">
                                            <input
                                                type="text"
                                                readOnly
                                                value={formatDateDisplay(this.state.dateRange.selection.startDate)}
                                            />
                                            <input
                                                type="text"
                                                readOnly
                                                value={formatDateDisplay(this.state.dateRange.selection.endDate, 'Continuous')}
                                            />
                                            <DateRange
                                                onChange={this.handleRangeChange}
                                                moveRangeOnFirstSelection={false}
                                                ranges={[this.state.dateRange.selection]}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="image">Upload Image:</label>
                                        <input
                                            type="file"
                                            id="image"
                                            className="form-control-file"
                                            onChange={this.handleImageChange}
                                        />
                                        {this.state.image && <img src={URL.createObjectURL(this.state.image)} alt="Event preview" className="image-preview" />}
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-primary">Create Event</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
