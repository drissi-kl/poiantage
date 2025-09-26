import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';


import Login from './views/auth/Login'
import Register from './views/auth/Registry';
import VerificationCode from './views/auth/verfication';
// import Home from './views/auth/Home';
// import Logout from './views/auth/Logout';
import Dashboard from './views/dashboard/Dashboard';
import HomeDashboard from './components/dashboard/home';
import Scn from './components/scn';


function App() {
  // Protected Route Component
  // const ProtectedRoute = ({ children }) => {
  //   const encrypted = getCookie("token");
    
  //   if (!encrypted) {
  //     return <Navigate to="/" replace />;
  //   }
    
  //   return children;
  // };

  // Public Route Component (redirect to dashboard if already logged in)
  // const PublicRoute = ({ children }) => {
  //   const encrypted = getCookie("token");
    
  //   if (encrypted) {
  //     return <Navigate to="/dashboard" replace />;
  //   }
    
  //   return children;
  // };

  return <>
        <BrowserRouter>

{/* jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj */}
    <div className="App">
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        {/* <Route path='/home' element={<Home/>} /> */}
        <Route path='/verification-code' element={<VerificationCode/>} />
        {/* <Route path='/logout' element={<Logout/>} /> */}
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/scn' element={<Scn/>} />
        {/* <Route 
          path="/" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />
        <Route 
          path="/verification-code" 
          element={
            <PublicRoute>
              <VerificationCode />
            </PublicRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        /> */}
        {/* Catch all route - redirect to login */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </div>
{/* jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj */}
  


      </BrowserRouter>
  </>
}

export default App
