import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface AppBarProps {
  setSidebarVisible: (isVisible: boolean) => void; // Callback to update sidebar visibility in parent component
}

const AppBar: React.FC<AppBarProps> = ({ setSidebarVisible }) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(false); // Local state to manage sidebar visibility
  const email = localStorage.getItem('username') || 'User';

  // Effect to communicate sidebar visibility to parent component
  useEffect(() => {
    setSidebarVisible(showSidebar);
  }, [showSidebar, setSidebarVisible]);

  // Function to toggle the sidebar's visibility
  const toggleSidebar = () => {
    setShowSidebar(prevShowSidebar => !prevShowSidebar);
  };

  return (
    <>
      <header className="bg-white text-black px-5 py-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div onClick={toggleSidebar} className="cursor-pointer">
            <svg className="w-9 h-9 p-1 rounded-full hover:bg-opacity-10 hover:bg-slate-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <img className="w-8 h-8 rounded-full" src="https://www.svgrepo.com/show/528641/square-academic-cap-2.svg" alt="Logo" />
            <div className="text-2xl font-semibold">Sphere</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 relative">
          <div>({email})</div>
          <div onClick={() => setShowMenu(!showMenu)} className="cursor-pointer">
            <img className="w-8 h-8 p-2 rounded-full hover:bg-opacity-10 hover:bg-slate-500" src="https://www.svgrepo.com/show/99553/plus.svg" alt="Plus icon" />
          </div>
          {showMenu && (
            <div className="absolute top-10 right-0 bg-white shadow-md rounded-lg overflow-hidden">
              <ul>
                <li>
                  <Link to="/create-event" className="block px-4 py-2 hover:bg-gray-100">Create Event</Link>
                </li>
                <li>
                  <Link to="/join-event" className="block px-4 py-2 hover:bg-gray-100">Join Event</Link>
                </li>
              </ul>
            </div>
          )}
          <Link to="/profile" className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-md">Profile</Link>
        </div>
      </header>
    </>
  );
};

export default AppBar;
