import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from './hooks/useToast';

// Layout
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import UserRegisterPage from './pages/auth/UserRegisterPage';
import RecruiterRegisterPage from './pages/auth/RecruiterRegisterPage';
import AdminRegisterPage from './pages/auth/AdminRegisterPage';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import JobListingPage from './pages/user/JobListingPage';
import JobDetailPage from './pages/user/JobDetailPage';
import MyApplicationsPage from './pages/user/MyApplicationsPage';
import SavedJobsPage from './pages/user/SavedJobsPage';
import UserProfilePage from './pages/user/UserProfilePage';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import CreateJobPage from './pages/recruiter/CreateJobPage';
import ManageJobsPage from './pages/recruiter/ManageJobsPage';
import ApplicationsManagementPage from './pages/recruiter/ApplicationsManagementPage';
import RecruiterProfilePage from './pages/recruiter/RecruiterProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ManageRecruitersPage from './pages/admin/ManageRecruitersPage';
import AdminManageJobsPage from './pages/admin/AdminManageJobsPage';
import AdminManageApplicationsPage from './pages/admin/AdminManageApplicationsPage';

// Error Pages
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/user" element={<UserRegisterPage />} />
          <Route path="/register/recruiter" element={<RecruiterRegisterPage />} />
          <Route path="/register/admin" element={<AdminRegisterPage />} />

          {/* === USER ROUTES === */}
          <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
            <Route element={<MainLayout />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/jobs" element={<JobListingPage />} />
              <Route path="/user/jobs/:id" element={<JobDetailPage />} />
              <Route path="/user/applications" element={<MyApplicationsPage />} />
              <Route path="/user/saved" element={<SavedJobsPage />} />
              <Route path="/user/profile" element={<UserProfilePage />} />
            </Route>
          </Route>

          {/* === RECRUITER ROUTES === */}
          <Route element={<ProtectedRoute allowedRoles={['RECRUITER']} />}>
            <Route element={<MainLayout />}>
              <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
              <Route path="/recruiter/jobs/create" element={<CreateJobPage />} />
              <Route path="/recruiter/jobs" element={<ManageJobsPage />} />
              <Route path="/recruiter/applications" element={<ApplicationsManagementPage />} />
              <Route path="/recruiter/profile" element={<RecruiterProfilePage />} />
            </Route>
          </Route>

          {/* === ADMIN ROUTES === */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route element={<MainLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsersPage />} />
              <Route path="/admin/recruiters" element={<ManageRecruitersPage />} />
              <Route path="/admin/jobs" element={<AdminManageJobsPage />} />
              <Route path="/admin/applications" element={<AdminManageApplicationsPage />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
