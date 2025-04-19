
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, User, LogOut, Home, Briefcase } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-4 md:px-8 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-purple" />
          <span className="font-bold text-xl text-gray-dark">CareerBridge</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-purple transition-colors">Home</Link>
          <Link to="/jobs" className="text-gray-700 hover:text-purple transition-colors">Find Jobs</Link>
          
          {currentUser?.role === 'employer' && (
            <Link to="/dashboard" className="text-gray-700 hover:text-purple transition-colors">Post Jobs</Link>
          )}
          
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-purple text-purple hover:bg-purple hover:text-white">
                  <User className="h-4 w-4 mr-2" />
                  {currentUser.name.split(' ')[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="font-medium leading-none">{currentUser.name}</p>
                    <p className="text-sm text-gray-neutral">{currentUser.email}</p>
                    <p className="text-xs text-gray-neutral capitalize">{currentUser.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button onClick={() => navigate('/register')}>
                Register
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md z-50 border-t border-gray-100">
          <div className="flex flex-col space-y-3 p-4">
            <Link to="/" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-light hover:text-purple" onClick={() => setIsMenuOpen(false)}>
              <Home className="h-4 w-4 inline mr-2" />
              Home
            </Link>
            <Link to="/jobs" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-light hover:text-purple" onClick={() => setIsMenuOpen(false)}>
              <Briefcase className="h-4 w-4 inline mr-2" />
              Find Jobs
            </Link>
            
            {currentUser?.role === 'employer' && (
              <Link to="/dashboard" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-light hover:text-purple" onClick={() => setIsMenuOpen(false)}>
                Post Jobs
              </Link>
            )}
            
            {currentUser ? (
              <>
                <Link to="/dashboard" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-light hover:text-purple" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/profile" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-light hover:text-purple" onClick={() => setIsMenuOpen(false)}>
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-md text-red-500 hover:bg-red-50 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-3">
                <Button variant="ghost" onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}>
                  Log in
                </Button>
                <Button onClick={() => {
                  navigate('/register');
                  setIsMenuOpen(false);
                }}>
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
