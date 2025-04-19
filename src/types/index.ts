
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'jobseeker' | 'employer';
}

export interface JobSeeker extends User {
  role: 'jobseeker';
  resume?: string;
  skills: string[];
  experience: Experience[];
}

export interface Employer extends User {
  role: 'employer';
  company: string;
  industry: string;
  companySize: string;
  logo?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  employerId: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
  salary?: string;
  description: string;
  requirements: string[];
  postedDate: string;
  deadline?: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobseekerId: string;
  status: 'pending' | 'shortlisted' | 'hired' | 'rejected';
  appliedDate: string;
  resume: string;
  coverLetter?: string;
}
