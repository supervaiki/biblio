import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, BookOpen, Calendar, User, RotateCcw } from 'lucide-react';

export const LoansManagement: React.FC = () => {
  const { loans, books, authors, returnBook } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  const filteredLoans = loans.filter(loan => {
    const book = books.find(b => b.id === loan.bookId);
    const author = authors.find(a => a.id === book?.authorId);
    const user = users.find((u: any) => u.id === loan.userId);
    
    const matchesSearch = !searchQuery || 
      book?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${author?.firstName} ${author?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${user?.firstName} ${user?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleReturn = (loanId: string) => {
    if (confirm('Confirmer le retour de ce livre ?')) {
      returnBook(loanId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'returned':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'En cours';
      case 'returned':
        return 'Retourné';
      case 'overdue':
        return 'En retard';
      default:
        return status;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Gestion des emprunts
        </h1>
        <p className="text-gray-600">
          Suivez et gérez tous les emprunts de la bibliothèque
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par livre, auteur ou utilisateur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">En cours</option>
              <option value="returned">Retournés</option>
              <option value="overdue">En retard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loans List */}
      <div className="space-y-4">
        {filteredLoans.map(loan => {
          const book = books.find(b => b.id === loan.bookId);
          const author = authors.find(a => a.id === book?.authorId);
          const user = users.find((u: any) => u.id === loan.userId);
          
          return (
            <Card key={loan.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">{book?.title}</p>
                        <p className="text-sm text-gray-600">
                          par {author?.firstName} {author?.lastName}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">
                          Emprunté: {new Date(loan.loanDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          À rendre: {new Date(loan.dueDate).toLocaleDateString()}
                        </p>
                        {loan.returnDate && (
                          <p className="text-sm text-green-600">
                            Retourné: {new Date(loan.returnDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(loan.status)}`}>
                      {getStatusLabel(loan.status)}
                    </span>
                    
                    {loan.status === 'active' && (
                      <Button
                        onClick={() => handleReturn(loan.id)}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <RotateCcw size={16} />
                        Retourner
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredLoans.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun emprunt trouvé
          </h3>
          <p className="text-gray-600">
            {searchQuery || statusFilter !== 'all' 
              ? 'Aucun emprunt ne correspond à vos critères' 
              : 'Aucun emprunt enregistré'
            }
          </p>
        </div>
      )}
    </div>
  );
};