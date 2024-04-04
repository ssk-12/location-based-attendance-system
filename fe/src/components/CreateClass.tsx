import React, { useState } from 'react';
import axios from 'axios';

const CreateClassForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    const token = localStorage.getItem('token'); // Assuming the token is stored with the key 'token'

    if (!token) {
      setError('No token found in local storage.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8787/api/v1/class/classes', { name, subject }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Handle response here, for example showing a success message
      console.log('Class created:', response.data);
    } catch (err) {
      console.error('Failed to create class:', err);
      setError('Failed to create class');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-12">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                 required />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
          <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)}
                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                 required />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          {isSubmitting ? 'Creating...' : 'Create Class'}
        </button>
      </form>
    </div>
  );
};

export default CreateClassForm;
