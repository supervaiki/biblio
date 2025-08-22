import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  BookOpen, 
  Users, 
  BookMarked, 
  Search,
  BarChart3 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Tableau de bord', roles: ['admin', 'user'] },
    { id: 'search', icon: Search, label: 'Rechercher', roles: ['admin', 'user'] },
    { id: 'books', icon: BookOpen, label: 'Gestion des livres', roles: ['admin'] },
    { id: 'authors', icon: Users, label: 'Gestion des auteurs', roles: ['admin'] },
    { id: 'loans', icon: BookMarked, label: 'Gestion des emprunts', roles: ['admin'] },
    { id: 'my-loans', icon: BookMarked, label: 'Mes emprunts', roles: ['user'] },
    { id: 'stats', icon: BarChart3, label: 'Statistiques', roles: ['admin'] },
  ];

  const filteredItems = menuItems.filter(item => 
    item.roles.includes(user?.role || 'user')
  );

  return (
    <div className="bg-gray-50 w-64 min-h-screen border-r border-gray-200">
      <nav className="mt-8">
        <div className="px-4">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg mb-2 transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={20} className="mr-3" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};