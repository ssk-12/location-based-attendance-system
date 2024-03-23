import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Signin } from './components/Signin';
import { RecoilRoot } from 'recoil';
import { Signup } from './components/Signup';
import Dashboard from './pages/Dashboard';
import AppBar from './components/AppBar';
import CreateEvent from './pages/CreateEvent';



// Layout Component
const Layout = () => {
  const location = useLocation();
  const hideAppbarPaths = ['/', '/signup', '/signin'];
  const showAppbar = !hideAppbarPaths.includes(location.pathname);

  return (
    <RecoilRoot> {/* Move RecoilRoot here to wrap everything */}
      <>
        {showAppbar && <AppBar/>}
        <Routes>
          <Route path="/" element={<Signin />} /> {/* Adjusted for consistency */}
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="//create-event" element={<CreateEvent />} />
          {/* Add other routes as needed */}
        </Routes>
      </>
    </RecoilRoot>
  );
};

// App Component
function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
