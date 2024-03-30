import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import AppBar from './components/AppBar';
import { Signin } from './components/Signin';
import { Signup } from './components/Signup';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import { RecoilRoot } from 'recoil';

const Layout = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
  const location = useLocation(); // Get the current location
  
  // Define paths where the AppBar should not be visible
  const hideAppBarPaths = ['/', '/signin', '/signup'];

  // Check if the AppBar should be hidden based on the current path
  const shouldHideAppBar = hideAppBarPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideAppBar && <AppBar setSidebarVisible={setIsSidebarVisible} />}
      {isSidebarVisible && (
        <div className="fixed top-16 left-0 w-64 h-[calc(100vh-64px)] bg-gray-100 shadow-xl overflow-auto z-40">
          {/* Sidebar content */}
          <ul className="flex flex-col p-4">
            <li className="p-2 hover:bg-gray-200"><a href="/">Home</a></li>
            <li className="p-2 hover:bg-gray-200"><a href="/calendar">Calendar</a></li>
            <li className="p-2 hover:bg-gray-200"><a href="/enrolled">Enrolled</a></li>
            <li className="p-2 hover:bg-gray-200"><a href="/todo">Todo</a></li>
            {/* Add more sidebar items as needed */}
          </ul>
        </div>
      )}
      <div className={`pt-16 transition-margin duration-500 ${isSidebarVisible && !shouldHideAppBar ? 'ml-64' : 'ml-0'}`}>
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-event" element={<CreateEvent />} />
          {/* More routes */}
        </Routes>
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </RecoilRoot>
  );
};

export default App;
