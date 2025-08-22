import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { BookCard } from '../components/books/BookCard';
import { BookForm } from '../components/books/BookForm';
import { Button } from '../components/ui/Button';
import { Book } from '../types';
import { Plus, Search } from 'lucide-react';

export const BooksManagement: React.FC = () => {
  const { books, authors, deleteBook } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>();

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    authors.find(a => a.id === book.authorId)?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    authors.find(a => a.id === book.authorId)?.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleDelete = (bookId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      deleteBook(bookId);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBook(undefined);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Gestion des livres
          </h1>
          <p className="text-gray-600">
            Gérez la collection de livres de la bibliothèque
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Ajouter un livre
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par titre ou auteur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map(book => {
          const author = authors.find(a => a.id === book.authorId);
          return (
            <BookCard
              key={book.id}
              book={book}
              author={author!}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          );
        })}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun livre trouvé
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? 'Aucun livre ne correspond à votre recherche' : 'Aucun livre dans la collection'}
          </p>
          <Button onClick={() => setShowForm(true)}>
            Ajouter le premier livre
          </Button>
        </div>
      )}

      <BookForm
        isOpen={showForm}
        onClose={handleCloseForm}
        book={editingBook}
      />
    </div>
  );
};