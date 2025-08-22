export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  createdAt: string;
  profilePicture?: string;
}

export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  biography?: string;
  birthDate?: string;
  nationality?: string;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  authorId: string;
  genre: string;
  publishDate: string;
  isbn?: string;
  description?: string;
  coverImage?: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
}

export interface Loan {
  id: string;
  bookId: string;
  userId: string;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  renewalCount: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'due_soon' | 'overdue' | 'returned' | 'renewal';
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
  isLoading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SearchFilters {
  query: string;
  genre: string;
  availability: 'all' | 'available' | 'borrowed';
}