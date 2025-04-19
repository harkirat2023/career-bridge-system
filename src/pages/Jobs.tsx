
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Search, MapPin, Briefcase, Calendar } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Job } from '@/types';
import { jobs as allJobs } from '@/data/mockData';

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>(allJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  
  // Get unique locations from job data
  const uniqueLocations = Array.from(new Set(allJobs.map(job => job.location)));

  // Job types for filtering
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

  const handleTypeFilterChange = (type: string) => {
    setTypeFilters(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter jobs based on search term, location, and job types
  useEffect(() => {
    let filteredJobs = [...allJobs];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredJobs = filteredJobs.filter(
        job => job.title.toLowerCase().includes(term) || 
               job.company.toLowerCase().includes(term) ||
               job.description.toLowerCase().includes(term)
      );
    }
    
    if (locationFilter) {
      filteredJobs = filteredJobs.filter(job => job.location === locationFilter);
    }
    
    if (typeFilters.length > 0) {
      filteredJobs = filteredJobs.filter(job => typeFilters.includes(job.type));
    }
    
    setJobs(filteredJobs);
  }, [searchTerm, locationFilter, typeFilters]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Find Your Perfect Job</h1>
          
          {/* Search and Filter Section */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-grow">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input 
                    placeholder="Job title, keywords, or company" 
                    className="pl-10 h-12 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Location Filter */}
              <div className="w-full md:w-64">
                <Select 
                  value={locationFilter} 
                  onValueChange={setLocationFilter}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    {uniqueLocations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Search Button */}
              <Button className="h-12 px-8">Search</Button>
            </div>
            
            {/* Additional Filters */}
            <Separator className="my-6" />
            
            <div>
              <h3 className="font-medium mb-3">Job Type</h3>
              <div className="flex flex-wrap gap-4">
                {jobTypes.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`type-${type}`} 
                      checked={typeFilters.includes(type)}
                      onCheckedChange={() => handleTypeFilterChange(type)}
                    />
                    <Label htmlFor={`type-${type}`}>{type}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Job Listings */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">{jobs.length} Job{jobs.length !== 1 ? 's' : ''} Found</h2>
            
            {jobs.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <h3 className="text-xl font-medium mb-2">No jobs found</h3>
                <p className="text-gray-medium">Try changing your search criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                          <p className="text-purple mb-2">{job.company}</p>
                          <div className="flex flex-wrap gap-3 mb-3">
                            <div className="flex items-center text-gray-500 text-sm">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center text-gray-500 text-sm">
                              <Briefcase className="h-4 w-4 mr-1" />
                              <span>{job.type}</span>
                            </div>
                            <div className="flex items-center text-gray-500 text-sm">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>Posted {formatDate(job.postedDate)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 md:mt-0">
                          {job.salary && (
                            <p className="text-gray-dark font-medium mb-3">{job.salary}</p>
                          )}
                          <Link to={`/jobs/${job.id}`}>
                            <Button>View Details</Button>
                          </Link>
                        </div>
                      </div>
                      
                      {/* Job Description Preview */}
                      <div className="mt-4">
                        <p className="text-gray-600 line-clamp-2">{job.description}</p>
                      </div>
                      
                      {/* Job Requirements Preview */}
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Requirements:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          {job.requirements.slice(0, 2).map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                          {job.requirements.length > 2 && (
                            <li>+{job.requirements.length - 2} more requirements</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Jobs;
