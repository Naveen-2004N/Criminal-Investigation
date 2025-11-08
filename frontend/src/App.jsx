import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '/src/context/AuthContext.jsx';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { messaging, getToken, onMessage } from './firebase';

import Layout from '/src/components/Layout.jsx';
import Dashboard from '/src/pages/Dashboard.jsx';
import RegisterCriminal from '/src/pages/RegisterCriminal.jsx';
import DetectCriminal from '/src/pages/DetectCriminal.jsx';
import VideoSurveillance from '/src/pages/VideoSurveillance.jsx'; // --- ADD THIS LINE ---
import CriminalProfile from '/src/pages/CriminalProfile.jsx';
import AllCriminals from '/src/pages/AllCriminals.jsx';
import GenerateSketch from '/src/pages/GenerateSketch.jsx';
import NotFound from '/src/pages/NotFound.jsx';
import Login from '/src/pages/Login.jsx';
import Register from '/src/pages/Register.jsx';

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAuth();
  return userInfo ? children : <Navigate to="/login" replace />;
};

function App() {
  const [token, setToken] = useState('');
  const [messages, setMessages] = useState([]);
  // const [faceName,setFaceName]=useState("rrrr");

  useEffect(() => {
    Notification.requestPermission().then(async (permission) => {
      console.log(permission)
      if (permission === 'granted') {
        const currentToken = await getToken(messaging, { vapidKey: 'BOqxFpVwOta81U9o6WEBJSRnWegFGI0Yd28Gu51XYrsAKXDuX4YN8LeDB8-POtUaXVYFRH8HeZr0koY09XfaFGA' });
        setToken(currentToken);
        console.log('FCM Token:', currentToken);
      }
    });

    onMessage(messaging, (payload) => {
      console.log('Message received: ', payload);
      alert(payload.notification.body);
      setMessages((prev) => [...prev, payload.notification.body]);
    });
  }, []);

  const scheduleNotification = async (faceName) => {
    console.log("token", token)
    if (!token) return alert('Token not generated yet!');
    await axios.post('http://localhost:5000/schedule-notification', {
      message: `${faceName} is detected`,
      token: token,
    });
  };
  return (
    <Router>
      {/* Wrap everything in the NotificationHandler */}
      {/* <NotificationHandler> */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="register-criminal" element={<RegisterCriminal />} />
          <Route path="detect" element={<DetectCriminal scheduleNotification={scheduleNotification} />} />
          {/* This line will now work */}
          <Route path="surveillance" element={<VideoSurveillance scheduleNotification={scheduleNotification} />} />
          <Route path="profile/:id" element={<CriminalProfile />} />
          <Route path="criminals" element={<AllCriminals />} />
          <Route path="generate-sketch" element={<GenerateSketch />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* </NotificationHandler> */}
    </Router>
  );
}

export default App;