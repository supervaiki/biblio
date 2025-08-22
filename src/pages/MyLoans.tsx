import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { BookOpen, Calendar, Clock } from 'lucide-react';

export const MyLoans: React.FC = () => {
  const { user } = useAuth();
  const { loans, books, authors } = useData();

  const myLoans = loans.filter(loan => loan.userId === user?.id);
  const activeLoans = myLoans.filter(loan => loan.status === 'active');
  const pastLoans = myLoans.filter(loan => loan.status === 'returned');

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const LoanCard = ({ loan }: { loan: any }) => {
    const book = books.find(b => b.id === loan.bookId);
    const author = authors.find(a => a.id === book?.authorId);
    const daysUntilDue = getDaysUntilDue(loan.dueDate);
    
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{book?.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                par {author?.firstName} {author?.lastName}
              </p>
              
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Emprunté le {new Date(loan.loanDate).toLocaleDateString()}</span>
                </div>
                
                {loan.status === 'active' ? (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>À rendre le {new Date(loan.dueDate).toLocaleDateString()}</span>
                    {daysUntilDue <= 3 && daysUntilDue > 0 && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full ml-2">
                        Plus que {daysUntilDue} jour(s)
                      </span>
                    )}
                    {daysUntilDue <= 0 && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full ml-2">
                        En retard
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">
                      Retourné le {new Date(loan.returnDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  loan.status === 'active' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {loan.status === 'active' ? 'En cours' : 'Retourné'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Mes emprunts
        </h1>
        <p className="text-gray-600">
          Suivez vos emprunts actuels et votre historique
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Loans */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Emprunts en cours ({activeLoans.length})
          </h2>
          
          {activeLoans.length > 0 ? (
            <div className="space-y-4">
              {activeLoans.map(loan => (
                <LoanCard key={loan.id} loan={loan} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun emprunt en cours
                </h3>
                <p className="text-gray-600">
                  Recherchez des livres pour commencer à emprunter
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Past Loans */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Historique ({pastLoans.length})
          </h2>
          
          {pastLoans.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {pastLoans
                .sort((a, b) => new Date(b.returnDate!).getTime() - new Date(a.returnDate!).getTime())
                .map(loan => (
                  <LoanCard key={loan.id} loan={loan} />
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun historique
                </h3>
                <p className="text-gray-600">
                  Vos anciens emprunts apparaîtront ici
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};