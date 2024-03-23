import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { usernameState, emailState } from '../state/atom';
import axios from 'axios';

interface Event {
  id: number;
  name: string;
  location: string;
  proximity: number;
  timestamp: string;
  hostId: number;
  latitude: number; 
  longitude: number; 
}

const Dashboard: React.FC = () => {
    const username = useRecoilValue(usernameState);
    const email = useRecoilValue(emailState);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get<Event[]>('http://localhost:8787/api/v1/allevents/events');
                setEvents(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching events:', error);
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleAttend = async (event:any) => {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const userLat = position.coords.latitude;
          const userLong = position.coords.longitude;
      
          
          const [eventLat, eventLong] = event.location.split(',').map(Number);
      
          
          const distance = calculateDistance(userLat, userLong, eventLat, eventLong);
            console.log(event.name,userLat, userLong, eventLat, eventLong)
            console.log(distance)
      
          if (distance <= event.proximity) {
            
            try {
              await axios.post('http://localhost:8787/api/v1/events/attend', {
                eventId: event.id,
                userEmail: email, 
                status: 'PRESENT', 
              });
              alert('Attendance marked as present!');
            } catch (error) {
              console.error('Error marking attendance:', error);
              alert('Failed to mark attendance');
            }
          } else {
            alert('You are too far from the event location.');
          }
        }, (error) => {
          console.error('Error getting location:', error);
        });
      };
      
      

      function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371000; // Earth's radius in meters
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = 
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in meters
        return distance;
    }
    
      

    function deg2rad(deg: number): number {
        return deg * (Math.PI/180);
    }

    return (
        <div className="dashboard bg-gray-100 min-h-screen p-8">
            <div className="user-profile bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="font-bold text-xl text-gray-800">Welcome, {username}!</h2>
                <p className="text-gray-600">Email: {email}</p>
            </div>
            <div className="events bg-white shadow-md rounded-lg p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-4">Upcoming Events</h3>
                {loading ? (
                    <p className="text-gray-600">Loading events...</p>
                ) : events.length > 0 ? (
                    <ul className="list-disc list-inside">
                        {events.map(event => (
                            <li key={event.id} className="text-gray-700 flex justify-between items-center">
                                {event.name} - {new Date(event.timestamp).toLocaleString()}
                                <button
                                    className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={() => handleAttend(event)}
                                >
                                    Attend
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No upcoming events.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
