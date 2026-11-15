import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateAssignment from './pages/CreateAssignment';
import SubmitAssignment from './pages/SubmitAssignment';
import Submissions from './pages/Submissions';
import Assignments from './pages/Assignments';
import EditAssignment from './pages/EditAssignment';

function PrivateRoute() {
  const { token, isLoading } = useAuth();
  if (isLoading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
  return token ? <Outlet /> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-assignment" element={<CreateAssignment />} />
            <Route path="/submit-assignment" element={<SubmitAssignment />} />
            <Route path="/submissions" element={<Submissions />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/assignments/:id/edit" element={<EditAssignment />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
