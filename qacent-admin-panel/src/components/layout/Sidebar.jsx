import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineBarChart,
  AiOutlineSetting,
  AiOutlineDown,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineLogout
} from 'react-icons/ai';
import { IoIosArrowDropright } from "react-icons/io";
import { menuItems } from '../../config/menuItems';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

function MenuItem({ item, isOpen, activeSubmenu, setActiveSubmenu }) {
  const location = useLocation();
  const Icon = item.icon;
  const isActive = location.pathname === item.path ||
    (item.submenu && item.submenu.some(subItem => location.pathname === subItem.path));
  const isSubmenuOpen = activeSubmenu === item.title;

  const handleSubmenuClick = () => {
    setActiveSubmenu(isSubmenuOpen ? null : item.title);
  };

  if (item.submenu) {
    return (
      <div className="mb-1">
        <button
          className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-all duration-200 ${isActive
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
            }`}
          onClick={handleSubmenuClick}
        >
          <div className="flex items-center">
            <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
            {isOpen && (
              <span className="ml-3 font-medium">
                {item.title}
              </span>
            )}
          </div>
          {isOpen && (
            <AiOutlineDown
              className={`w-4 h-4 transition-transform duration-300 ${isSubmenuOpen ? 'transform rotate-180' : ''
                }`}
            />
          )}
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSubmenuOpen && isOpen ? 'max-h-96 mt-1' : 'max-h-0'
          }`}>
          {item.submenu.map((subItem) => (
            <Link
              key={subItem.path}
              to={subItem.path}
              className={`flex items-center pl-11 pr-4 py-2.5 text-sm rounded-lg transition-all duration-200 ${location.pathname === subItem.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              <IoIosArrowDropright className={location.pathname === subItem.path ? 'text-blue-600' : 'text-gray-400'} />
              <span className="ml-2">{subItem.title}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Link
      to={item.path}
      className={`flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200 mb-1 ${isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-600 hover:bg-gray-50'
        }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
      {isOpen && (
        <span className="ml-3 font-medium">
          {item.title}
        </span>
      )}
    </Link>
  );
}

export default function Sidebar({ isOpen, toggleSidebar }) {
  const dispatch = useDispatch();
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const location = useLocation();
  const user=useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    setActiveSubmenu(null);
  }, [location.pathname]);

  return (
    <div
      className={`bg-white ${isOpen ? 'w-64' : 'w-20'
        } min-h-screen transition-all duration-300 relative shadow-lg`}
    >
      {/* Logo Area */}
      <div className="flex items-center h-16 px-4 border-b">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">A</span>
          </div>
          {isOpen && (
            <span className="ml-3 text-lg font-bold text-gray-800">
              Admin
            </span>
          )}
        </div>
      </div>

      {/* Toggle Button - Hidden on Mobile */}
      <button
        onClick={toggleSidebar}
        className="hidden md:block absolute -right-4 top-20 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 z-50 cursor-pointer"
      >
        {isOpen ? (
          <AiOutlineLeft className="w-5 h-5 text-gray-600" />
        ) : (
          <AiOutlineRight className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Navigation */}
      <div className="px-3 py-4">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <MenuItem
              key={item.title}
              item={item}
              isOpen={isOpen}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
            />
          ))}
        </nav>
      </div>

      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
        <div className={`flex items-center ${!isOpen && 'justify-center'}`}>
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <img
              src="https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff"
              alt="User"
              className="w-8 h-8 rounded-lg"
            />
          </div>
          {isOpen && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800">{user?.full_name || 'John Doe'}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          )}
        </div>
        {/* {isOpen && (
          <button
            onClick={handleLogout}
            className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-gray-600 hover:text-red-600 rounded-lg transition-colors duration-200 hover:bg-gray-50"
          >
            <AiOutlineLogout className="w-5 h-5" />
            <span className="ml-2">Logout</span>
          </button>
        )} */}
      </div>
    </div>
  );
}
