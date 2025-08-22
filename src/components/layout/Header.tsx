import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '../ui/Button';
import { LogOut, Bell, User, BookOpen } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { notifications } = useData();

  const unreadCount = notifications.filter(n => !n.read && n.userId === user?.id).length;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-900">
              Bibliothèque Municipale
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User size={20} className="text-gray-400" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};