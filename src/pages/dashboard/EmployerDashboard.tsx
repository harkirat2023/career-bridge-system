
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Building, PlusCircle, Briefcase, Users, Clock, CheckCircle, X, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useJob } from '@/context/JobContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Form schema for job posting
const jobFormSchema = z.object({
  title: z.string().min(3, { message: "Job title must be at least 3 characters" }),
  location: z.string().min(2, { message: "Location is required" }),
  type: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']),
  salary: z.string().optional(),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  requirements: z.string().min(10, { message: "Requirements must be at least 10 characters" }),
  deadline: z.string().optional()
});

type JobFormValues = z.infer<typeof jobFormSchema>;

const EmployerDashboard = () => {
  const { currentUser } = useAuth();
  const { jobs, applications, addJob, getApplicationsByJob, updateApplicationStatus } = useJob();
  const [activeTab, setActiveTab] = useState('jobs');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  if (!currentUser || currentUser.role !== 'employer') {
    return null;
  }
  
  const employer = currentUser as import('@/types').Employer;
  
  // Filter jobs posted by this employer
  const employerJobs = jobs.filter(job => job.employerId === employer.id);
  
  // Form handling for new job posting
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      location: "",
      type: "Full-time",
      salary: "",
      description: "",
      requirements: "",
      deadline: ""
    }
  });

  const handleCreateJob = (values: JobFormValues) => {
    // Parse requirements from textarea to array
    const requirementsArray = values.requirements
      .split('\n')
      .filter(req => req.trim().length > 0);
    
    addJob({
      title: values.title,
      company: employer.company,
      employerId: employer.id,
      location: values.location,
      type: values.type,
      salary: values.salary,
      description: values.description,
      requirements: requirementsArray,
      deadline: values.deadline,
    });
    
    setDialogOpen(false);
    form.reset();
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleUpdateApplicationStatus = (applicationId: string, status: 'pending' | 'shortlisted' | 'hired' | 'rejected') => {
    updateApplicationStatus(applicationId, status);
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
                    <Building className="h-5 w-5 text-purple mr-2" />
                    <span>Company Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 bg-purple/20 rounded-full flex items-center justify-center text-purple text-2xl font-bold mb-3">
                      {employer.company[0]}
                    </div>
                    <h3 className="text-xl font-semibold">{employer.company}</h3>
                    <p className="text-gray-medium">{employer.industry}</p>
                    <p className="text-sm text-gray-500">Company size: {employer.companySize}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <Link to="/profile">
                      <Button variant="outline" className="w-full">
                        Edit Company Profile
                      </Button>
                    </Link>
                    
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Post a Job
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                          <DialogTitle>Post a New Job</DialogTitle>
                        </DialogHeader>
                        
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(handleCreateJob)} className="space-y-4 py-4">
                            <FormField
                              control={form.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Job Title*</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Frontend Developer" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Location*</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g. New Delhi, Remote" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Job Type*</FormLabel>
                                    <Select 
                                      onValueChange={field.onChange} 
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select job type" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="Full-time">Full-time</SelectItem>
                                        <SelectItem value="Part-time">Part-time</SelectItem>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="Internship">Internship</SelectItem>
                                        <SelectItem value="Remote">Remote</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="salary"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Salary Range (Optional)</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g. ₹8,00,000 - ₹12,00,000" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="deadline"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Application Deadline (Optional)</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Job Description*</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Describe the responsibilities and qualifications for this role" 
                                      className="min-h-[120px]"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="requirements"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Job Requirements*</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Enter each requirement on a new line" 
                                      className="min-h-[120px]"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                  <p className="text-xs text-gray-500">Enter each requirement on a new line</p>
                                </FormItem>
                              )}
                            />
                            
                            <DialogFooter>
                              <Button type="submit">Post Job</Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 text-purple mr-2" />
                    <span>Job Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-medium">Active Postings</span>
                      <Badge variant="outline">{employerJobs.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-medium">Total Applications</span>
                      <Badge variant="outline">
                        {employerJobs.reduce((total, job) => {
                          return total + getApplicationsByJob(job.id).length;
                        }, 0)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold mb-6">Employer Dashboard</h1>
              
              <Tabs defaultValue="jobs" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="jobs">My Job Postings</TabsTrigger>
                  <TabsTrigger value="applications">Applications</TabsTrigger>
                </TabsList>
                
                <TabsContent value="jobs" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">My Job Postings</h2>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Post a Job
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-xl">
                        {/* Same form as above */}
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {employerJobs.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Briefcase className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium mb-2">No Job Postings Yet</h3>
                        <p className="text-gray-medium mb-4">Start attracting candidates by posting your first job.</p>
                        <DialogTrigger asChild>
                          <Button>Post a Job Now</Button>
                        </DialogTrigger>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {employerJobs.map(job => {
                        const jobApplications = getApplicationsByJob(job.id);
                        return (
                          <Card key={job.id}>
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row md:justify-between">
                                <div>
                                  <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                                  <div className="flex flex-wrap gap-3 mb-3">
                                    <div className="flex items-center text-gray-500 text-sm">
                                      <Briefcase className="h-4 w-4 mr-1" />
                                      <span>{job.type}</span>
                                    </div>
                                    <div className="flex items-center text-gray-500 text-sm">
                                      <Clock className="h-4 w-4 mr-1" />
                                      <span>Posted {formatDate(job.postedDate)}</span>
                                    </div>
                                    <div className="flex items-center text-gray-500 text-sm">
                                      <Users className="h-4 w-4 mr-1" />
                                      <span>{jobApplications.length} applications</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-start space-x-3 mt-4 md:mt-0">
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Users className="h-4 w-4 mr-2" />
                                    View Applicants
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="applications" className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
                  
                  {employerJobs.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Briefcase className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium mb-2">No Job Postings Yet</h3>
                        <p className="text-gray-medium mb-4">You need to post jobs to receive applications.</p>
                        <DialogTrigger asChild>
                          <Button>Post a Job Now</Button>
                        </DialogTrigger>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      {employerJobs.map(job => {
                        const jobApplications = getApplicationsByJob(job.id);
                        
                        if (jobApplications.length === 0) {
                          return null;
                        }
                        
                        return (
                          <Card key={job.id} className="mb-6">
                            <CardHeader>
                              <CardTitle>{job.title}</CardTitle>
                              <CardDescription>
                                Posted on {formatDate(job.postedDate)}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {jobApplications.map(application => {
                                // Find corresponding job seeker
                                const applicant = application.jobseekerId;
                                
                                return (
                                  <div key={application.id} className="border-b border-gray-100 py-4 last:border-0">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                      <div>
                                        <h4 className="font-medium">Applicant #{application.id}</h4>
                                        <div className="flex items-center text-gray-500 text-sm mt-1">
                                          <Clock className="h-4 w-4 mr-1" />
                                          <span>Applied on {formatDate(application.appliedDate)}</span>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center space-x-2 mt-3 md:mt-0">
                                        {application.status === 'pending' ? (
                                          <>
                                            <Button 
                                              size="sm" 
                                              onClick={() => handleUpdateApplicationStatus(application.id, 'shortlisted')}
                                            >
                                              Shortlist
                                            </Button>
                                            <Button 
                                              variant="outline"
                                              size="sm"
                                              onClick={() => handleUpdateApplicationStatus(application.id, 'rejected')}
                                            >
                                              Reject
                                            </Button>
                                          </>
                                        ) : application.status === 'shortlisted' ? (
                                          <>
                                            <Badge className="bg-blue">
                                              <CheckCircle className="h-3 w-3 mr-1" /> Shortlisted
                                            </Badge>
                                            <Button 
                                              size="sm" 
                                              onClick={() => handleUpdateApplicationStatus(application.id, 'hired')}
                                            >
                                              Hire
                                            </Button>
                                            <Button 
                                              variant="outline"
                                              size="sm"
                                              onClick={() => handleUpdateApplicationStatus(application.id, 'rejected')}
                                            >
                                              Reject
                                            </Button>
                                          </>
                                        ) : application.status === 'hired' ? (
                                          <Badge className="bg-green-600">
                                            <CheckCircle className="h-3 w-3 mr-1" /> Hired
                                          </Badge>
                                        ) : (
                                          <Badge variant="destructive">
                                            <X className="h-3 w-3 mr-1" /> Rejected
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </CardContent>
                            <CardFooter>
                              <Button variant="outline" size="sm" className="w-full">
                                View All Applicants
                              </Button>
                            </CardFooter>
                          </Card>
                        );
                      })}
                      
                      {employerJobs.every(job => getApplicationsByJob(job.id).length === 0) && (
                        <Card>
                          <CardContent className="flex flex-col items-center justify-center py-12">
                            <Users className="h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-xl font-medium mb-2">No Applications Yet</h3>
                            <p className="text-gray-medium">
                              You haven't received any applications for your job postings yet.
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
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

export default EmployerDashboard;
