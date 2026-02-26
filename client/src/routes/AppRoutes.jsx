import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Services from '../pages/Services';
import MarketingPlatform from '../pages/MarketingPlatform';
import DesignStudio from '../pages/DesignStudio';
import MediaCreator from '../pages/MediaCreator';
import Login from '../pages/Login';
import Register from '../pages/Register';
import OwnerDashboard from '../pages/OwnerDashboard';
import ClientDashboard from '../pages/ClientDashboard';
import Checkout from '../pages/Checkout';
import PrivateRoute from '../components/PrivateRoute';
import AdminRoute from '../components/AdminRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/marketing" element={<MarketingPlatform />} />
      <Route path="/design-studio" element={<DesignStudio />} />
      <Route path="/media-creator" element={<MediaCreator />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/client-dashboard" element={<PrivateRoute><ClientDashboard /></PrivateRoute>} />
      <Route path="/owner" element={<AdminRoute><OwnerDashboard /></AdminRoute>} />
    </Routes>
  );
};

export default AppRoutes;
