import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { BookCard } from '../components/books/BookCard';
import { SearchFilters } from '../types';
import { Search, Filter } from 'lucide-react';

export const SearchBooks: React.FC = () => {
  const { books, authors, searchBooks } = useData();
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    genre: 'all',
    availability: 'all'
  });

  const genres = ['all', ...Array.from(new Set(books.map(book => book.genre)))];

  const filteredBooks = useMemo(() => {
    return searchBooks(filters.query, filters.genre, filters.availability);
  }, [filters, searchBooks]);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Rechercher des livres
        </h1>
        <p className="text-gray-600">
          Trouvez les livres qui vous intéressent
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par titre ou auteur..."
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              value={filters.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les genres</option>
              {genres.filter(g => g !== 'all').map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filters.availability}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les livres</option>
              <option value="available">Disponibles uniquement</option>
              <option value="borrowed">Empruntés</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          {filteredBooks.length} livre(s) trouvé(s)
        </p>
      </div>

      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map(book => {
            const author = authors.find(a => a.id === book.authorId);
            return (
              <BookCard
                key={book.id}
                book={book}
                author={author!}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun livre trouvé
          </h3>
          <p className="text-gray-600">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      )}
    </div>
  );
};