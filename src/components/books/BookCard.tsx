import React from 'react';
import { Book, Author } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Edit, Trash2, BookPlus } from 'lucide-react';

interface BookCardProps {
  book: Book;
  author: Author;
  onEdit?: (book: Book) => void;
  onDelete?: (bookId: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, author, onEdit, onDelete }) => {
  const { user } = useAuth();
  const { createLoan } = useData();

  const handleBorrow = () => {
    if (user && book.availableCopies > 0) {
      createLoan(book.id, user.id);
    }
  };

  const isAvailable = book.availableCopies > 0;

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{book.title}</h3>
            <p className="text-gray-600 mb-2">par {author.firstName} {author.lastName}</p>
            <div className="space-y-1 text-sm text-gray-500 mb-4">
              <p><span className="font-medium">Genre:</span> {book.genre}</p>
              <p><span className="font-medium">Publié:</span> {new Date(book.publishDate).getFullYear()}</p>
              <p><span className="font-medium">ISBN:</span> {book.isbn}</p>
            </div>
            
            <div className="mb-4">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isAvailable 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isAvailable ? 'Disponible' : 'Emprunté'}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {book.availableCopies}/{book.totalCopies} exemplaires disponibles
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            {user?.role === 'admin' ? (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit?.(book)}
                  className="flex items-center gap-1 flex-1"
                >
                  <Edit size={14} />
                  Modifier
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete?.(book.id)}
                  className="flex items-center gap-1"
                >
                  <Trash2 size={14} />
                </Button>
              </>
            ) : (
              <Button
                onClick={handleBorrow}
                disabled={!isAvailable}
                className="flex items-center gap-2 w-full"
              >
                <BookPlus size={16} />
                {isAvailable ? 'Emprunter' : 'Non disponible'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};