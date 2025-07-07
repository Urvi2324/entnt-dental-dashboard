
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import Patients from './pages/admin/Patients';
import PatientDetail from './pages/admin/PatientDetail';
import AppointmentsCalendar from './pages/admin/AppointmentsCalendar';
import MyProfile from './pages/patient/MyProfile';
import MyApointments from './pages/patient/MyApointments';
import Layout from './components/Layout';
import { UserRole } from './types';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </DataProvider>
    </AuthProvider>
  );
};

const AppRoutes: React.FC = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

            <Route path="/" element={
              <ProtectedRoute roles={[UserRole.Admin, UserRole.Patient]}>
                <Layout />
              </ProtectedRoute>
            }>
              {/* Admin Routes */}
              <Route index element={
                  user?.role === UserRole.Admin ? <Dashboard /> : <Navigate to="/my-appointments" />
              } />
              <Route path="dashboard" element={
                <ProtectedRoute roles={[UserRole.Admin]}><Dashboard /></ProtectedRoute>
              } />
              <Route path="patients" element={
                <ProtectedRoute roles={[UserRole.Admin]}><Patients /></ProtectedRoute>
              } />
              <Route path="patients/:id" element={
                <ProtectedRoute roles={[UserRole.Admin]}><PatientDetail /></ProtectedRoute>
              } />
              <Route path="appointments" element={
                <ProtectedRoute roles={[UserRole.Admin]}><AppointmentsCalendar /></ProtectedRoute>
              } />

              {/* Patient Routes */}
              <Route path="my-profile" element={
                <ProtectedRoute roles={[UserRole.Patient]}><MyProfile /></ProtectedRoute>
              } />
              <Route path="my-appointments" element={
                <ProtectedRoute roles={[UserRole.Patient]}><MyApointments /></ProtectedRoute>
              } />
            </Route>
            
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
        </Routes>
    );
};


interface ProtectedRouteProps {
  children: React.ReactElement;
  roles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-background">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (!roles.includes(user.role)) {
     return <Navigate to="/" />;
  }

  return children;
};

export default App;
