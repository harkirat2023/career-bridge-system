
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import JobseekerDashboard from './dashboard/JobseekerDashboard';
import EmployerDashboard from './dashboard/EmployerDashboard';

const Dashboard = () => {
  const { currentUser } = useAuth();
  
  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Render appropriate dashboard based on user role
  return (
    <>
      {currentUser.role === 'jobseeker' ? (
        <JobseekerDashboard />
      ) : (
        <EmployerDashboard />
      )}
    </>
  );
};

export default Dashboard;
