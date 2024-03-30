import { Link } from 'react-router-dom';

const AppBar = () => {
  const email = localStorage.getItem('username')

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-lg font-bold">AcademicSphere</div>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link to="/events" className="hover:text-gray-300">View Events</Link>
          </li>
          <li>
            <Link to="/create-event" className="hover:text-gray-300">Create Event</Link>
          </li>
        </ul>
      </nav>
      <div className="flex items-center space-x-3">
        
        <div>({email})</div>
        <Link to="/profile" className="bg-gray-700 hover:bg-gray-600 py-1 px-3 rounded">Profile</Link>
      </div>
    </header>
  );
};

export default AppBar;
