
import { createContext, useContext, useState, ReactNode } from 'react';
import { Job, Application } from '@/types';
import { jobs as initialJobs, applications as initialApplications } from '@/data/mockData';

interface JobContextType {
  jobs: Job[];
  applications: Application[];
  addJob: (job: Omit<Job, 'id' | 'postedDate'>) => void;
  updateJobStatus: (jobId: string, status: string) => void;
  applyToJob: (application: Omit<Application, 'id' | 'appliedDate' | 'status'>) => void;
  getJobById: (id: string) => Job | undefined;
  getApplicationsByJob: (jobId: string) => Application[];
  getApplicationsByJobseeker: (jobseekerId: string) => Application[];
  updateApplicationStatus: (applicationId: string, status: Application['status']) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [applications, setApplications] = useState<Application[]>(initialApplications);

  const addJob = (job: Omit<Job, 'id' | 'postedDate'>) => {
    const newJob: Job = {
      ...job,
      id: `${jobs.length + 1}`,
      postedDate: new Date().toISOString().split('T')[0]
    };
    
    setJobs([...jobs, newJob]);
  };

  const updateJobStatus = (jobId: string, status: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status } : job
    ));
  };

  const applyToJob = (application: Omit<Application, 'id' | 'appliedDate' | 'status'>) => {
    const newApplication: Application = {
      ...application,
      id: `${applications.length + 1}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    
    setApplications([...applications, newApplication]);
  };

  const getJobById = (id: string) => {
    return jobs.find(job => job.id === id);
  };

  const getApplicationsByJob = (jobId: string) => {
    return applications.filter(application => application.jobId === jobId);
  };

  const getApplicationsByJobseeker = (jobseekerId: string) => {
    return applications.filter(application => application.jobseekerId === jobseekerId);
  };

  const updateApplicationStatus = (applicationId: string, status: Application['status']) => {
    setApplications(applications.map(application => 
      application.id === applicationId ? { ...application, status } : application
    ));
  };

  return (
    <JobContext.Provider value={{ 
      jobs, 
      applications,
      addJob,
      updateJobStatus,
      applyToJob,
      getJobById,
      getApplicationsByJob,
      getApplicationsByJobseeker,
      updateApplicationStatus
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJob = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJob must be used within a JobProvider');
  }
  return context;
};
