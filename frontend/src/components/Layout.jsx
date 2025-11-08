import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, UserPlus, Search, Video, LogOut, Menu, X, Shield, Users, Brush } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/criminals', icon: <Users size={20} />, label: 'Criminal Records' },
    { path: '/register-criminal', icon: <UserPlus size={20} />, label: 'Register Criminal' },
    { path: '/detect', icon: <Search size={20} />, label: 'Detect by Image' },
    { path: '/surveillance', icon: <Video size={20} />, label: 'Live Surveillance' },
    { path: '/generate-sketch', icon: <Brush size={20} />, label: 'Generate Sketch' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div 
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <Shield className="mr-2 text-blue-400" size={24} />
          <h1 className="text-xl font-bold">CrimeSight</h1>
        </div>

        <nav className="mt-8 flex flex-col justify-between" style={{height: 'calc(100% - 4rem)'}}>
          <div className="px-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 mt-2 text-sm rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
          
          <div className="px-4 mb-4 border-t border-gray-700 pt-4">
            <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 mt-2 text-sm text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200">
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      <main className="flex-1 lg:ml-64">
        <div className="min-h-screen p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;