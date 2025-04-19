
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, MapPin, Calendar, Briefcase, Building, AlertCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Job } from '@/types';
import { jobs } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { useJob } from '@/context/JobContext';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const { applyToJob } = useJob();
  const navigate = useNavigate();
  const [coverLetter, setCoverLetter] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Find the job by id
  const job = jobs.find(job => job.id === id);

  if (!job) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
          <p className="mb-8">The job listing you're looking for doesn't exist or has been removed.</p>
          <Link to="/jobs">
            <Button>Browse All Jobs</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleApply = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (currentUser.role !== 'jobseeker') {
      return;
    }
    
    // In a real app, this would upload a resume and submit the application
    applyToJob({
      jobId: job.id,
      jobseekerId: currentUser.id,
      resume: 'mock_resume.pdf', // In a real app, this would be the uploaded file
      coverLetter
    });
    
    setDialogOpen(false);
    setShowSuccessAlert(true);
    
    // Hide the success alert after 5 seconds
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 5000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          
          {/* Success Alert */}
          {showSuccessAlert && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                Your application has been submitted successfully! You can track its status in your dashboard.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Job Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                <div className="flex items-center mb-4">
                  <Building className="h-5 w-5 text-purple mr-2" />
                  <span className="text-purple font-medium">{job.company}</span>
                </div>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="h-5 w-5 mr-2" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Posted on {formatDate(job.postedDate)}</span>
                  </div>
                </div>
                {job.salary && (
                  <div className="text-lg font-medium text-gray-dark">{job.salary}</div>
                )}
              </div>
              
              <div className="mt-6 md:mt-0">
                {currentUser?.role === 'jobseeker' ? (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg">Apply Now</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Apply for {job.title}</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="mb-4">
                          <div className="font-medium mb-2">Cover Letter (Optional)</div>
                          <Textarea 
                            placeholder="Tell the employer why you're a good fit for this role..."
                            className="h-32"
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                          />
                        </div>
                        <div className="mb-4">
                          <div className="font-medium mb-2">Resume</div>
                          <div className="border border-gray-200 rounded p-4 flex justify-between items-center bg-gray-50">
                            <span className="text-gray-600">mock_resume.pdf</span>
                            <Button variant="outline" size="sm">Change</Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            In a real app, you would upload your resume here.
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleApply}>Submit Application</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : currentUser?.role === 'employer' ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800 max-w-md">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Employer Account</p>
                        <p className="mt-1">You're logged in as an employer and cannot apply to jobs.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button size="lg" onClick={() => navigate('/login')}>
                    Login to Apply
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Job Description */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <div className="prose max-w-none">
                  <p>{job.description}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h3 className="text-lg font-semibold mb-4">Job Overview</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">Posted Date</div>
                    <div>{formatDate(job.postedDate)}</div>
                  </div>
                  
                  {job.deadline && (
                    <div>
                      <div className="text-sm text-gray-500">Application Deadline</div>
                      <div>{formatDate(job.deadline)}</div>
                    </div>
                  )}
                  
                  <div>
                    <div className="text-sm text-gray-500">Job Type</div>
                    <div>{job.type}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Location</div>
                    <div>{job.location}</div>
                  </div>
                  
                  {job.salary && (
                    <div>
                      <div className="text-sm text-gray-500">Salary Range</div>
                      <div>{job.salary}</div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  {currentUser?.role === 'jobseeker' ? (
                    <Button className="w-full" onClick={() => setDialogOpen(true)}>
                      Apply Now
                    </Button>
                  ) : !currentUser ? (
                    <Button className="w-full" onClick={() => navigate('/login')}>
                      Login to Apply
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JobDetail;
