import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EnrollInClassForm: React.FC = () => {
  const [classId, setClassId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Assuming your API expects an authorization token, you should retrieve it first.
      // This example assumes the token is stored in localStorage.
      const token = localStorage.getItem('token');

      if (!token) {
        alert('You must be logged in to enroll in a class.');
        navigate('/login');
        return;
      }

      await axios.post('http://127.0.0.1:8787/api/v1/class/enroll', { classId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Successfully enrolled in class!');
      navigate('/dashboard'); // Redirect to a dashboard or another page as needed
    } catch (error) {
      console.error('Failed to enroll in class:', error);
      alert('Failed to enroll in class. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="classId" className="block text-sm font-medium text-gray-700">
          Class ID
        </label>
        <input
          type="text"
          id="classId"
          name="classId"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          required
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Enroll
      </button>
    </form>
  );
};

export default EnrollInClassForm;
