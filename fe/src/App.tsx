import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Signin } from './components/Signin';
import { RecoilRoot } from 'recoil';



const Layout = () => {
  // const location = useLocation();
  
  // const hideAppbarPaths = ['/', '/signup', '/signin'];
  // const showAppbar = !hideAppbarPaths.includes(location.pathname);

  return (
    <>
      {/* {showAppbar && <Appbar/>} */}
      <RecoilRoot>
      <Routes>
        {/* <Route path="/" element={<Auth />} />
        <Route path="/signup" element={<Auth auth="signup" />} />
        <Route path="/signin" element={<Auth />} />
        <Route path="/dashboard" element={<BlogPosts />} />
        <Route path="/blog/:id" element={<Blogs />} />
        <Route path="/create" element={<CreateBlog />} />
        <Route path="/test" element={<Blogs />} />
        <Route path="/drafts" element={<Drafts />} />
        <Route path="/posts" element={<Userblogs />} /> */}
        <Route path="/signin" element={<Signin />} />
      </Routes>
      </RecoilRoot>
    </>
  );
};


function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;