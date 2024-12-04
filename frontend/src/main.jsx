import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import CreateUser from './pages/CreateUser';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import SearchUser from './pages/SearchUser';

const Root = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  const router = createBrowserRouter([
    {
      path: '/login',
      element: !user ? <Login /> : <Navigate to="/" />,
    },
    {
      path: '/register',
      element: !user ? <CreateUser /> : <Navigate to="/" />,
    },
    {
      path: '/user/:username',
      element: <UserProfile />,
    },
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/search/:query',
      element: <SearchUser />,
    }
  ]);

  return <RouterProvider router={router} />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Root />
    </AuthProvider>
  </React.StrictMode>,
)