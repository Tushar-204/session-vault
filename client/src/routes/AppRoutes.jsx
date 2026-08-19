import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute, GuestRoute } from './ProtectedRoute';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Dashboard } from '../pages/Dashboard';
import { WorkspaceDetails } from '../pages/WorkspaceDetails';
import { Favorites } from '../pages/Favorites';
import { Folders } from '../pages/Folders';
import { Trash } from '../pages/Trash';
import { Analytics } from '../pages/Analytics';
import { Settings } from '../pages/Settings';
import { SharedView } from '../pages/SharedView';
import { SharedLinks } from '../pages/SharedLinks';
import  SearchPage  from '../pages/Search';
import ImportExportPage from '../pages/ImportExport';

const DashboardWithContext = () => {
  const { searchValue } = useOutletContext();
  return <Dashboard searchFilter={searchValue} />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />

      {/* Public shared session view (no auth required) */}
      <Route path="/share/:code" element={<SharedView />} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardWithContext />} />
        <Route path="workspace/:id" element={<WorkspaceDetails />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="folders" element={<Folders />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="trash" element={<Trash />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="shared" element={<SharedLinks />} />
        <Route path="import-export" element={<ImportExportPage />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};
