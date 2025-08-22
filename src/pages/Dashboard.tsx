import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { BookOpen, Users, BookMarked, TrendingUp } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { books, authors, loans } = useData();

  const activeLoans = loans.filter(loan => loan.status === 'active');
  const userLoans = loans.filter(loan => loan.userId === user?.id && loan.status === 'active');
  const totalAvailableBooks = books.reduce((sum, book) => sum + book.availableCopies, 0);

  const adminStats = [
    {
      title: 'Total des livres',
      value: books.length,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Auteurs',
      value: authors.length,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Emprunts actifs',
      value: activeLoans.length,
      icon: BookMarked,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Livres disponibles',
      value: totalAvailableBooks,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const userStats = [
    {
      title: 'Mes emprunts actifs',
      value: userLoans.length,
      icon: BookMarked,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Livres disponibles',
      value: totalAvailableBooks,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  const stats = user?.role === 'admin' ? adminStats : userStats;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Bienvenue, {user?.firstName} {user?.lastName}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor} mr-4`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {user?.role === 'user' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Mes emprunts récents</h2>
            </CardHeader>
            <CardContent>
              {userLoans.length > 0 ? (
                <div className="space-y-3">
                  {userLoans.slice(0, 5).map(loan => {
                    const book = books.find(b => b.id === loan.bookId);
                    const author = authors.find(a => a.id === book?.authorId);
                    return (
                      <div key={loan.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{book?.title}</p>
                          <p className="text-sm text-gray-600">par {author?.firstName} {author?.lastName}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          <p>À rendre le:</p>
                          <p>{new Date(loan.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Aucun emprunt en cours
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Nouveautés</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {books
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5)
                  .map(book => {
                    const author = authors.find(a => a.id === book.authorId);
                    return (
                      <div key={book.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-sm text-gray-600">par {author?.firstName} {author?.lastName}</p>
                        </div>
                        <div className="text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            book.availableCopies > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {book.availableCopies > 0 ? 'Disponible' : 'Emprunté'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};