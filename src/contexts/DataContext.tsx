import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, Author, Loan, Notification } from '../types';

interface DataContextType {
  books: Book[];
  authors: Author[];
  loans: Loan[];
  notifications: Notification[];
  addBook: (book: Omit<Book, 'id' | 'createdAt'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addAuthor: (author: Omit<Author, 'id' | 'createdAt'>) => void;
  updateAuthor: (id: string, author: Partial<Author>) => void;
  deleteAuthor: (id: string) => void;
  createLoan: (bookId: string, userId: string) => void;
  returnBook: (loanId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  searchBooks: (query: string, genre?: string, availability?: string) => Book[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

const initialAuthors: Author[] = [
  {
    id: '1',
    firstName: 'Victor',
    lastName: 'Hugo',
    biography: 'Écrivain français du XIXe siècle',
    birthDate: '1802-02-26',
    nationality: 'Française',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    firstName: 'Marguerite',
    lastName: 'Yourcenar',
    biography: 'Première femme élue à l\'Académie française',
    birthDate: '1903-06-08',
    nationality: 'Française',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

const initialBooks: Book[] = [
  {
    id: '1',
    title: 'Les Misérables',
    authorId: '1',
    genre: 'Roman',
    publishDate: '1862-01-01',
    isbn: '978-2070409228',
    description: 'Roman historique français',
    totalCopies: 5,
    availableCopies: 3,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Mémoires d\'Hadrien',
    authorId: '2',
    genre: 'Roman historique',
    publishDate: '1951-01-01',
    isbn: '978-2070360017',
    description: 'Récit à la première personne de l\'empereur Hadrien',
    totalCopies: 3,
    availableCopies: 2,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Initialize data from localStorage or use defaults
    const savedBooks = localStorage.getItem('books');
    const savedAuthors = localStorage.getItem('authors');
    const savedLoans = localStorage.getItem('loans');
    const savedNotifications = localStorage.getItem('notifications');

    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    } else {
      setBooks(initialBooks);
      localStorage.setItem('books', JSON.stringify(initialBooks));
    }

    if (savedAuthors) {
      setAuthors(JSON.parse(savedAuthors));
    } else {
      setAuthors(initialAuthors);
      localStorage.setItem('authors', JSON.stringify(initialAuthors));
    }

    if (savedLoans) {
      setLoans(JSON.parse(savedLoans));
    }

    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }

    // Initialize admin user if not exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
      const adminUser = {
        id: '1',
        email: 'admin@library.com',
        firstName: 'Admin',
        lastName: 'Library',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('users', JSON.stringify([adminUser]));
    }
  }, []);

  const addBook = (bookData: Omit<Book, 'id' | 'createdAt'>) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
  };

  const updateBook = (id: string, bookData: Partial<Book>) => {
    const updatedBooks = books.map(book =>
      book.id === id ? { ...book, ...bookData } : book
    );
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
  };

  const deleteBook = (id: string) => {
    const updatedBooks = books.filter(book => book.id !== id);
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
  };

  const addAuthor = (authorData: Omit<Author, 'id' | 'createdAt'>) => {
    const newAuthor: Author = {
      ...authorData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedAuthors = [...authors, newAuthor];
    setAuthors(updatedAuthors);
    localStorage.setItem('authors', JSON.stringify(updatedAuthors));
  };

  const updateAuthor = (id: string, authorData: Partial<Author>) => {
    const updatedAuthors = authors.map(author =>
      author.id === id ? { ...author, ...authorData } : author
    );
    setAuthors(updatedAuthors);
    localStorage.setItem('authors', JSON.stringify(updatedAuthors));
  };

  const deleteAuthor = (id: string) => {
    const updatedAuthors = authors.filter(author => author.id !== id);
    setAuthors(updatedAuthors);
    localStorage.setItem('authors', JSON.stringify(updatedAuthors));
  };

  const createLoan = (bookId: string, userId: string) => {
    const book = books.find(b => b.id === bookId);
    if (!book || book.availableCopies <= 0) return;

    const newLoan: Loan = {
      id: Date.now().toString(),
      bookId,
      userId,
      loanDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
      status: 'active',
      renewalCount: 0,
    };

    const updatedLoans = [...loans, newLoan];
    setLoans(updatedLoans);
    localStorage.setItem('loans', JSON.stringify(updatedLoans));

    // Update book availability
    updateBook(bookId, { availableCopies: book.availableCopies - 1 });
  };

  const returnBook = (loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;

    const updatedLoans = loans.map(l =>
      l.id === loanId
        ? { ...l, returnDate: new Date().toISOString(), status: 'returned' as const }
        : l
    );
    setLoans(updatedLoans);
    localStorage.setItem('loans', JSON.stringify(updatedLoans));

    // Update book availability
    const book = books.find(b => b.id === loan.bookId);
    if (book) {
      updateBook(book.id, { availableCopies: book.availableCopies + 1 });
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const searchBooks = (query: string, genre?: string, availability?: string): Book[] => {
    return books.filter(book => {
      const author = authors.find(a => a.id === book.authorId);
      const authorName = author ? `${author.firstName} ${author.lastName}` : '';
      
      const matchesQuery = !query || 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        authorName.toLowerCase().includes(query.toLowerCase());
      
      const matchesGenre = !genre || genre === 'all' || book.genre === genre;
      
      let matchesAvailability = true;
      if (availability === 'available') {
        matchesAvailability = book.availableCopies > 0;
      } else if (availability === 'borrowed') {
        matchesAvailability = book.availableCopies < book.totalCopies;
      }
      
      return matchesQuery && matchesGenre && matchesAvailability;
    });
  };

  const value: DataContextType = {
    books,
    authors,
    loans,
    notifications,
    addBook,
    updateBook,
    deleteBook,
    addAuthor,
    updateAuthor,
    deleteAuthor,
    createLoan,
    returnBook,
    markNotificationAsRead,
    searchBooks,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};