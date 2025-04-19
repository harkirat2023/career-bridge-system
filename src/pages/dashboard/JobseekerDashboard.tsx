
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, CheckCircle, Clock, FileText, User, X, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useJob } from '@/context/JobContext';
import { jobs } from '@/data/mockData';

const JobseekerDashboard = () => {
  const { currentUser } = useAuth();
  const { getApplicationsByJobseeker } = useJob();
  const [activeTab, setActiveTab] = useState('applications');
  
  if (!currentUser || currentUser.role !== 'jobseeker') {
    return null;
  }
  
  const jobseeker = currentUser;
  const applications = getApplicationsByJobseeker(jobseeker.id);
  
  // Get corresponding job details for each application
  const applicationsWithJobs = applications.map(application => {
    const job = jobs.find(job => job.id === application.jobId);
    return { ...application, job };
  });
  
  // Filter applications by status
  const pendingApplications = applicationsWithJobs.filter(app => app.status === 'pending');
  const shortlistedApplications = applicationsWithJobs.filter(app => app.status === 'shortlisted');
  const hiredApplications = applicationsWithJobs.filter(app => app.status === 'hired');
  const rejectedApplications = applicationsWithJobs.filter(app => app.status === 'rejected');
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const renderApplicationStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'shortlisted':
        return <Badge className="bg-blue"><CheckCircle className="h-3 w-3 mr-1" /> Shortlisted</Badge>;
      case 'hired':
        return <Badge className="bg-green-600 hover:bg-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Hired</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 text-purple mr-2" />
                    <span>Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 bg-purple/20 rounded-full flex items-center justify-center text-purple text-2xl font-bold mb-3">
                      {jobseeker.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className="text-xl font-semibold">{jobseeker.name}</h3>
                    <p className="text-gray-medium">{jobseeker.email}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {/* @ts-ignore - We know jobseeker has skills in our mock data */}
                        {jobseeker.skills.map((skill, index) => (
                          <Badge key={index} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Link to="/profile">
                      <Button variant="outline" className="w-full">
                        Edit Profile
                      </Button>
                    </Link>
                    
                    <Link to="/jobs">
                      <Button className="w-full">
                        Find Jobs
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 text-purple mr-2" />
                    <span>Application Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-medium">Total Applications</span>
                      <Badge variant="outline">{applications.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-medium">Pending</span>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        {pendingApplications.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-medium">Shortlisted</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue hover:bg-blue-100">
                        {shortlistedApplications.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-medium">Hired</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                        {hiredApplications.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-medium">Rejected</span>
                      <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                        {rejectedApplications.length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
              
              <Tabs defaultValue="applications" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="applications">Applications</TabsTrigger>
                  <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="applications" className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">My Applications</h2>
                    
                    {applications.length === 0 ? (
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                          <Briefcase className="h-12 w-12 text-gray-300 mb-4" />
                          <h3 className="text-xl font-medium mb-2">No Applications Yet</h3>
                          <p className="text-gray-medium mb-4">You haven't applied to any jobs yet.</p>
                          <Link to="/jobs">
                            <Button>Find Jobs</Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        {applicationsWithJobs.map(application => (
                          <Card key={application.id}>
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold mb-1">
                                    {application.job?.title}
                                  </h3>
                                  <p className="text-purple mb-2">{application.job?.company}</p>
                                  <div className="flex flex-wrap gap-3 mb-3">
                                    <div className="flex items-center text-gray-500 text-sm">
                                      <Briefcase className="h-4 w-4 mr-1" />
                                      <span>{application.job?.type}</span>
                                    </div>
                                    <div className="flex items-center text-gray-500 text-sm">
                                      <Clock className="h-4 w-4 mr-1" />
                                      <span>Applied on {formatDate(application.appliedDate)}</span>
                                    </div>
                                  </div>
                                  <div className="mb-3">
                                    {renderApplicationStatus(application.status)}
                                  </div>
                                </div>
                                
                                <div className="mt-4 md:mt-0 flex space-x-3">
                                  <Link to={`/jobs/${application.jobId}`}>
                                    <Button variant="outline">View Job</Button>
                                  </Link>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="saved">
                  <Card>
                    <CardHeader>
                      <CardTitle>Saved Jobs</CardTitle>
                      <CardDescription>
                        Access your saved jobs quickly and apply when you're ready.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-4">
                      <div className="flex flex-col items-center justify-center py-8">
                        <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium mb-2">No Saved Jobs</h3>
                        <p className="text-gray-medium">You haven't saved any jobs yet.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="recommendations">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended Jobs</CardTitle>
                      <CardDescription>
                        Jobs that match your skills and experience.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-8">
                        <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
                        <p className="text-gray-medium mb-4">
                          Job recommendations based on your profile will appear here.
                        </p>
                        <Link to="/profile">
                          <Button>Complete Your Profile</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JobseekerDashboard;
