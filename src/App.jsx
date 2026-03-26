import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import UserRegisterPage from './pages/auth/UserRegisterPage';
import RecruiterRegisterPage from './pages/auth/RecruiterRegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ManageRecruitersPage from './pages/admin/ManageRecruitersPage';
import AdminManageJobsPage from './pages/admin/ManageJobsPage';
import SystemLogsPage from './pages/admin/SystemLogsPage';

import UserDashboard from './pages/user/UserDashboard';
import JobListingPage from './pages/user/JobListingPage';
import JobDetailPage from './pages/user/JobDetailPage';
import SavedJobsPage from './pages/user/SavedJobsPage';
import ApplicationHistoryPage from './pages/user/ApplicationHistoryPage';
import UserProfilePage from './pages/user/UserProfilePage';

import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import CreateJobPage from './pages/recruiter/CreateJobPage';
import ManageJobsPage from './pages/recruiter/ManageJobsPage';
import ApplicationsManagementPage from './pages/recruiter/ApplicationsManagementPage';
import RecruiterProfilePage from './pages/recruiter/RecruiterProfilePage';

import './styles/animations.css';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/user" element={<UserRegisterPage />} />
      <Route path="/register/recruiter" element={<RecruiterRegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Candidate Routes */}
      <Route path="/user" element={<ProtectedRoute role="USER"><UserDashboard /></ProtectedRoute>} />
      <Route path="/user/jobs" element={<ProtectedRoute role="USER"><JobListingPage /></ProtectedRoute>} />
      <Route path="/user/jobs/:id" element={<ProtectedRoute role="USER"><JobDetailPage /></ProtectedRoute>} />
      <Route path="/user/saved-jobs" element={<ProtectedRoute role="USER"><SavedJobsPage /></ProtectedRoute>} />
      <Route path="/user/applications" element={<ProtectedRoute role="USER"><ApplicationHistoryPage /></ProtectedRoute>} />
      <Route path="/user/profile" element={<ProtectedRoute role="USER"><UserProfilePage /></ProtectedRoute>} />
      
      {/* Recruiter Routes */}
      <Route path="/recruiter" element={<ProtectedRoute role="RECRUITER"><RecruiterDashboard /></ProtectedRoute>} />
      <Route path="/recruiter/jobs" element={<ProtectedRoute role="RECRUITER"><ManageJobsPage /></ProtectedRoute>} />
      <Route path="/recruiter/jobs/create" element={<ProtectedRoute role="RECRUITER"><CreateJobPage /></ProtectedRoute>} />
      <Route path="/recruiter/applications" element={<ProtectedRoute role="RECRUITER"><ApplicationsManagementPage /></ProtectedRoute>} />
      <Route path="/recruiter/profile" element={<ProtectedRoute role="RECRUITER"><RecruiterProfilePage /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="ADMIN"><ManageUsersPage /></ProtectedRoute>} />
      <Route path="/admin/recruiters" element={<ProtectedRoute role="ADMIN"><ManageRecruitersPage /></ProtectedRoute>} />
      <Route path="/admin/jobs" element={<ProtectedRoute role="ADMIN"><AdminManageJobsPage /></ProtectedRoute>} />
      <Route path="/admin/logs" element={<ProtectedRoute role="ADMIN"><SystemLogsPage /></ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
