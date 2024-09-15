import React, { Component } from 'react';
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
        address: '', // Location as a simple string
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
        image: null // State to handle image file
    };

    handleChange = (event) => {
        this.setState({ address: event.target.value });
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
        this.setState({ loading: true });
    
        const title = this.refs.title.value;
        const details = this.refs.details.value;
        const location = this.state.address; // Use the location as a simple string
        const date = {
            start: this.state.dateRange.selection.startDate.toISOString(),
            end: this.state.dateRange.selection.endDate.toISOString(),
        };
    
        // Create FormData object
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', details);
        formData.append('location', location); // Append location as a string
        formData.append('startDate', date.start);
        formData.append('endDate', date.end);
        if (this.state.image) {
            formData.append('image', this.state.image); // Append the image file
        }
    
        REQUEST_EVENT_CREATE(formData, (err, res) => {
            this.setState({ loading: false }); // Fix to stop loading
            if (err) {
                this.setState({ errorMessage: "Could not connect to the internet" });
                return;
            }
    
            const body = getBody(res);
    
            if (body.success) { // Ensure `body.success` is checked for success
                this.setState({ successMessage: "Event created successfully", errorMessage: "" });
            } else {
                this.setState({ errorMessage: body.message });
            }
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
                                        <input
                                            type="text"
                                            id="location"
                                            className="form-control"
                                            value={this.state.address}
                                            onChange={this.handleChange}
                                            placeholder="Enter location"
                                        />
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
