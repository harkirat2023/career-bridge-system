
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Search, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { jobs } from "@/data/mockData";

const Index = () => {
  const { currentUser } = useAuth();

  // Get the three most recent job listings
  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple/90 to-blue/80 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Dream Career
            </h1>
            <p className="text-xl md:text-2xl text-white mb-10 max-w-3xl mx-auto">
              Connect with top employers and discover opportunities that match your skills and aspirations.
            </p>
            
            {/* Search Box */}
            <div className="bg-white p-2 rounded-lg shadow-lg flex flex-col md:flex-row max-w-4xl mx-auto">
              <div className="flex-grow mb-2 md:mb-0 md:mr-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input 
                    placeholder="Job title, keywords, or company" 
                    className="pl-10 h-12 w-full" 
                  />
                </div>
              </div>
              <Button size="lg" className="h-12">
                Search Jobs
              </Button>
            </div>
            
            {/* Stats */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 md:gap-12 text-white">
              <div>
                <p className="text-3xl md:text-4xl font-bold">1,000+</p>
                <p>Job Openings</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold">500+</p>
                <p>Companies</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold">2,000+</p>
                <p>Job Seekers</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Jobs Section */}
        <section className="py-16 bg-gray-light">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Job Opportunities</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                    <p className="text-purple mb-2">{job.company}</p>
                    <p className="text-gray-medium mb-4">
                      <span className="mr-3">{job.location}</span>
                      <span className="bg-gray-light text-gray-dark text-xs px-2 py-1 rounded">{job.type}</span>
                    </p>
                    <div className="mb-4 line-clamp-3 text-sm text-gray-medium">
                      {job.description}
                    </div>
                    <div className="flex justify-between items-center">
                      {job.salary ? (
                        <span className="text-sm font-medium">{job.salary}</span>
                      ) : (
                        <span></span>
                      )}
                      <Link to={`/jobs/${job.id}`}>
                        <Button variant="outline" size="sm">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link to="/jobs">
                <Button variant="outline" className="group">
                  View All Jobs
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="bg-purple/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Search Jobs</h3>
                <p className="text-gray-medium">
                  Browse through thousands of job listings tailored to your skills and preferences.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-purple/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Apply with Ease</h3>
                <p className="text-gray-medium">
                  Submit applications with just a few clicks and track your application status.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-purple/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCheck className="h-8 w-8 text-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Hired</h3>
                <p className="text-gray-medium">
                  Connect with employers, schedule interviews, and land your dream job.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              {currentUser ? (
                <Link to="/dashboard">
                  <Button size="lg">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button size="lg">
                    Create Your Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
        
        {/* For Employers Section */}
        <section className="bg-gradient-to-r from-blue/90 to-purple/80 py-16 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h2 className="text-3xl font-bold mb-4">For Employers</h2>
                <p className="text-xl mb-6">
                  Find the right talent for your organization quickly and efficiently.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 mr-2" />
                    <span>Post job listings and reach thousands of qualified candidates</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 mr-2" />
                    <span>Review applications and manage candidates in one place</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 mr-2" />
                    <span>Streamline your hiring process and reduce time-to-hire</span>
                  </li>
                </ul>
                
                <Link to={currentUser?.role === 'employer' ? '/dashboard' : '/register'}>
                  <Button className="bg-white text-blue hover:bg-gray-100">
                    {currentUser?.role === 'employer' ? 'Post a Job' : 'Register as Employer'}
                  </Button>
                </Link>
              </div>
              
              <div className="md:w-1/2 flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=500&h=400" 
                  alt="Employer Dashboard" 
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple/20 rounded-full flex items-center justify-center text-purple font-bold">
                    RS
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold">Rahul Singh</p>
                    <p className="text-sm text-gray-medium">Software Engineer</p>
                  </div>
                </div>
                <p className="text-gray-dark">
                  "CareerBridge helped me find the perfect job that matched my skills and career goals. 
                  Within two weeks of signing up, I had multiple interview offers!"
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue/20 rounded-full flex items-center justify-center text-blue font-bold">
                    AP
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold">Anjali Patel</p>
                    <p className="text-sm text-gray-medium">UX Designer</p>
                  </div>
                </div>
                <p className="text-gray-dark">
                  "The platform's intuitive interface and job matching algorithm made it easy for me to find 
                  relevant opportunities. I landed my dream job at a top tech company!"
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange/20 rounded-full flex items-center justify-center text-orange font-bold">
                    TI
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold">Tech Innovations</p>
                    <p className="text-sm text-gray-medium">Hiring Manager</p>
                  </div>
                </div>
                <p className="text-gray-dark">
                  "As an employer, CareerBridge has simplified our recruitment process. We're able to find 
                  qualified candidates quickly, saving time and resources on hiring."
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-gray-light py-12">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-dark mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers and employers already using CareerBridge to connect talent with opportunity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg">Create Account</Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" size="lg">Browse Jobs</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
