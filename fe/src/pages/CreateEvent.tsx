import React, { useState } from 'react';
import axios from 'axios';

const CreateEvent: React.FC = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [proximity, setProximity] = useState('');
    const [timestamp, setTimestamp] = useState('');

    const handleLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        function success(position: GeolocationPosition) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            setLocation(`${latitude},${longitude}`);
        }

        function error() {
            alert('Unable to retrieve your location');
        }

        navigator.geolocation.getCurrentPosition(success, error);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Ensure location has been set
        if (!location) {
            alert('Please allow access to your location.');
            return;
        }

        const event = {
            name,
            location,
            proximity: parseFloat(proximity),
            timestamp,
            hostId: 1, // Assuming a static hostId for simplicity
        };

        try {
            await axios.post('http://localhost:8787/api/v1/allevents/event/create', event);
            alert('Event created successfully');
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Failed to create event');
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Create Event</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="Event Name"
                    required
                />
                <div>
                    <button type="button" onClick={handleLocation} className="btn btn-secondary w-full">Use My Location</button>
                    <p className="text-xs text-gray-500 mt-1">Location: {location || 'Not set'}</p>
                </div>
                <input
                    type="text"
                    value={proximity}
                    onChange={(e) => setProximity(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="Proximity (in meters)"
                    required
                />
                <input
                    type="datetime-local"
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                    className="input input-bordered w-full"
                    required
                />
                <button type="submit" className="btn btn-primary w-full">Create Event</button>
            </form>
        </div>
    );
};

export default CreateEvent;
