import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface User {
    userId: string;
    name: string;
    email: string;
  }
  
  const BulkAttendanceMarker: React.FC = () => {
    const { classId } = useParams<'classId'>(); // Extracting classId from URL parameters
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchEnrolledUsers = async () => {
        if (!classId) return; // Guard clause in case classId is undefined
        setIsLoading(true);
        try {
          const response = await axios.get<User[]>(`http://127.0.0.1:8787/api/v1/class/class/${classId}/enrollments`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
          setUsers(response.data);
        } catch (error) {
          console.error('Error fetching enrolled users:', error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchEnrolledUsers();
    }, [classId]);

  const handleCheckboxChange = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`http://127.0.0.1:8787/api/v1/class/class/${classId}/attendance/bulk`, {
        userIds: selectedUsers,
        status: 'PRESENT',
      }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
      alert('Attendance marked successfully');
      // Optionally, clear selections after submission
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Mark Attendance for Class {classId}</h1>
      {isLoading ? (
        <p className="text-center">Loading users...</p>
      ) : (
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }} className="space-y-2">
          {users.map(user => (
            <div key={user.userId} className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={selectedUsers.includes(user.userId)}
                onChange={() => handleCheckboxChange(user.userId)}
              />
              <label className="ml-2 text-lg">{user.name} ({user.email})</label>
            </div>
          ))}
          <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors">
            Submit Attendance
          </button>
        </form>
      )}
    </div>
  );
};

export default BulkAttendanceMarker;
