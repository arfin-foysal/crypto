import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineLogout, AiOutlineDown, AiOutlineUser, AiOutlineLock } from 'react-icons/ai';
import Sidebar from './Sidebar';
import { logout } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function Layout({ children, user }) {
  // Track both mobile and desktop sidebar states separately
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState({
    mobile: false,
    desktop: true
  });
  

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => ({
      ...prev,
      [isMobile ? 'mobile' : 'desktop']: !prev[isMobile ? 'mobile' : 'desktop']
    }));
  };

  // Update sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Preserve the state when switching between mobile and desktop
      setSidebarOpen(prev => ({
        mobile: mobile ? false : prev.mobile,
        desktop: !mobile ? true : prev.desktop
      }));
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isOpen={isMobile ? sidebarOpen.mobile : sidebarOpen.desktop}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md">
          <div className="flex justify-between items-center px-4 py-2">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={toggleSidebar}
              className="block md:hidden p-2 rounded-lg text-indigo-800 hover:bg-indigo-50 transition-colors duration-200"
            >
              <AiOutlineMenu className="h-6 w-6" />
            </button>

            {/* User Profile with Dropdown */}
            <div className="ml-auto flex items-center">
              <div
                className="flex items-center space-x-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                  <AiOutlineUser className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 font-medium">{user?.full_name || 'John Doe'}</span>
                  <AiOutlineDown
                    className={`h-4 w-4 text-gray-500 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                      }`}
                  />
                </div>
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-4 top-16 w-48 bg-white shadow-lg rounded-lg border border-gray-100 py-1 z-50"
                >
                  <button
                    onClick={handleProfile}
                    className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 transition-colors duration-200"
                  >
                    <AiOutlineUser className="h-5 w-5 mr-2 text-indigo-600" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                  >
                    <AiOutlineLogout className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="container-fluid mx-auto">
            {children}
          </div>

        </main>
        <footer className="bg-white shadow-md p-2 text-right text-gray-600 text-xs">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
