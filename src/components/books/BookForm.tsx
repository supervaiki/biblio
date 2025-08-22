import React, { useState, useEffect } from 'react';
import { Book, Author } from '../../types';
import { useData } from '../../contexts/DataContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface BookFormProps {
  isOpen: boolean;
  onClose: () => void;
  book?: Book;
}

export const BookForm: React.FC<BookFormProps> = ({ isOpen, onClose, book }) => {
  const { authors, addBook, updateBook } = useData();
  const [formData, setFormData] = useState({
    title: '',
    authorId: '',
    genre: '',
    publishDate: '',
    isbn: '',
    description: '',
    totalCopies: 1,
    availableCopies: 1,
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        authorId: book.authorId,
        genre: book.genre,
        publishDate: book.publishDate,
        isbn: book.isbn || '',
        description: book.description || '',
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
      });
    } else {
      setFormData({
        title: '',
        authorId: '',
        genre: '',
        publishDate: '',
        isbn: '',
        description: '',
        totalCopies: 1,
        availableCopies: 1,
      });
    }
  }, [book, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (book) {
      updateBook(book.id, formData);
    } else {
      addBook(formData);
    }
    
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value
    }));
  };

  const genres = [
    'Roman', 'Science-fiction', 'Fantasy', 'Thriller', 'Romance',
    'Histoire', 'Biographie', 'Essai', 'Poésie', 'Théâtre', 'Autre'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={book ? 'Modifier le livre' : 'Ajouter un livre'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Auteur *
          </label>
          <select
            name="authorId"
            value={formData.authorId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionner un auteur</option>
            {authors.map(author => (
              <option key={author.id} value={author.id}>
                {author.firstName} {author.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Genre *
          </label>
          <select
            name="genre"
            value={formData.genre}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionner un genre</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de publication *
          </label>
          <input
            type="date"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ISBN
          </label>
          <input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="978-..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exemplaires total *
            </label>
            <input
              type="number"
              name="totalCopies"
              value={formData.totalCopies}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exemplaires disponibles *
            </label>
            <input
              type="number"
              name="availableCopies"
              value={formData.availableCopies}
              onChange={handleInputChange}
              min="0"
              max={formData.totalCopies}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            {book ? 'Modifier' : 'Ajouter'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </form>
    </Modal>
  );
};