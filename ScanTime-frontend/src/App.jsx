import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';


import Login from './views/auth/Login'
import Register from './views/auth/Registry';
import VerificationCode from './views/auth/verfication';
import Dashboard from './views/dashboard/Dashboard';
import { getToken } from './utilities/utilities';


function App() {
  const PublicRoute = ({children}) => {
      const permession = getToken();
      if(permession){
        return <Navigate to="/dashboard" />;
      }
      return children;
  }

  const PrivateRoute = ({children}) => {
      const permession = getToken();
      if(!permession){
        return <Navigate to="/" />;
      }
      return children;
  }
  
  return <>
        <BrowserRouter>
          
          <div className="App">
            <Routes>
              <Route path='/' element={ <PublicRoute><Login/></PublicRoute> } />
              <Route path='/register' element={  <PublicRoute><Register/></PublicRoute>} />
              <Route path='/verification-code' element={  <PublicRoute><VerificationCode/></PublicRoute> } />
              <Route path='/dashboard' element={ <PrivateRoute><Dashboard/></PrivateRoute> } />
              
            </Routes>
          </div>

      </BrowserRouter>
  </>
}

export default App
