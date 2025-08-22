import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Author } from '../types';
import { Plus, Edit, Trash2, Search, User } from 'lucide-react';

export const AuthorsManagement: React.FC = () => {
  const { authors, books, addAuthor, updateAuthor, deleteAuthor } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | undefined>();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    biography: '',
    birthDate: '',
    nationality: ''
  });

  const filteredAuthors = authors.filter(author =>
    `${author.firstName} ${author.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (author.nationality?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
  );

  const getAuthorBookCount = (authorId: string) => {
    return books.filter(book => book.authorId === authorId).length;
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setFormData({
      firstName: author.firstName,
      lastName: author.lastName,
      biography: author.biography || '',
      birthDate: author.birthDate || '',
      nationality: author.nationality || ''
    });
    setShowForm(true);
  };

  const handleDelete = (authorId: string) => {
    const bookCount = getAuthorBookCount(authorId);
    if (bookCount > 0) {
      alert(`Impossible de supprimer cet auteur car ${bookCount} livre(s) lui sont associés.`);
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer cet auteur ?')) {
      deleteAuthor(authorId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAuthor) {
      updateAuthor(editingAuthor.id, formData);
    } else {
      addAuthor(formData);
    }
    
    handleCloseForm();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAuthor(undefined);
    setFormData({
      firstName: '',
      lastName: '',
      biography: '',
      birthDate: '',
      nationality: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Gestion des auteurs
          </h1>
          <p className="text-gray-600">
            Gérez les auteurs de la bibliothèque
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Ajouter un auteur
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou nationalité..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Authors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAuthors.map(author => (
          <Card key={author.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {author.firstName} {author.lastName}
                    </h3>
                    {author.nationality && (
                      <p className="text-sm text-gray-600">{author.nationality}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {author.birthDate && (
                  <div>
                    <p className="text-sm text-gray-500">Date de naissance</p>
                    <p className="font-medium">
                      {new Date(author.birthDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-500">Livres publiés</p>
                  <p className="font-medium">{getAuthorBookCount(author.id)} livre(s)</p>
                </div>

                {author.biography && (
                  <div>
                    <p className="text-sm text-gray-500">Biographie</p>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {author.biography}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(author)}
                    className="flex items-center gap-1 flex-1"
                  >
                    <Edit size={14} />
                    Modifier
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(author.id)}
                    className="flex items-center gap-1"
                    disabled={getAuthorBookCount(author.id) > 0}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAuthors.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun auteur trouvé
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? 'Aucun auteur ne correspond à votre recherche' : 'Aucun auteur enregistré'}
          </p>
          <Button onClick={() => setShowForm(true)}>
            Ajouter le premier auteur
          </Button>
        </div>
      )}

      {/* Author Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingAuthor ? 'Modifier l\'auteur' : 'Ajouter un auteur'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de naissance
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nationalité
            </label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ex: Française"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biographie
            </label>
            <textarea
              name="biography"
              value={formData.biography}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Biographie de l'auteur..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingAuthor ? 'Modifier' : 'Ajouter'}
            </Button>
            <Button type="button" variant="secondary" onClick={handleCloseForm}>
              Annuler
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};