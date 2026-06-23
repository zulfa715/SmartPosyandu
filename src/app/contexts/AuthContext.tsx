import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'kader' | 'orangtua';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  nama: string;
  email?: string;
  posyandu: string;
  phone?: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  login: (credential1: string, credential2: string, isOrangTua?: boolean) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const KADERS: Array<User & { password: string }> = [
  {
    id: 'k1',
    username: 'dewi',
    role: 'kader',
    nama: 'Dewi Lestari',
    posyandu: 'Teratai 4',
    password: 'kader123'
  },
  {
    id: 'k2',
    username: 'siti',
    role: 'kader',
    nama: 'Siti Aminah',
    posyandu: 'Teratai 4',
    password: 'kader123'
  },
  {
    id: 'k3',
    username: 'ani',
    role: 'kader',
    nama: 'Ani Wijaya',
    posyandu: 'Teratai 4',
    password: 'kader123'
  },
  {
    id: 'k4',
    username: 'rina',
    role: 'kader',
    nama: 'Rina Susanti',
    posyandu: 'Teratai 4',
    password: 'kader123'
  }
];

// Orang tua login using username + no HP
const ORANGTUA_ACCOUNTS = [
  {
    id: 'ot1',
    username: 'sulastri',
    phone: '081234567890',
    nama: 'Sulastri',
    posyandu: 'Teratai 4',
    orangtua_id: 'ot1'
  },
  {
    id: 'ot2',
    username: 'budisantoso',
    phone: '081298765432',
    nama: 'Budi Santoso',
    posyandu: 'Teratai 4',
    orangtua_id: 'ot2'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('smart_posyandu_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (credential1: string, credential2: string, isOrangTua: boolean = false): Promise<boolean> => {
    const now = new Date().toISOString();
    let foundUser: User | undefined;

    if (isOrangTua) {
      // credential1 = username, credential2 = no HP
      const account = ORANGTUA_ACCOUNTS.find(
        a => a.username.toLowerCase() === credential1.toLowerCase() && a.phone === credential2
      );
      if (account) {
        foundUser = {
          id: account.id,
          username: account.username,
          role: 'orangtua',
          nama: account.nama,
          posyandu: 'Teratai 4',
          phone: account.phone,
          lastLogin: now
        };
      }
    } else {
      // credential1 = username (nama kader lowercase), credential2 = password
      const kader = KADERS.find(
        k => k.username === credential1.toLowerCase() && k.password === credential2
      );
      if (kader) {
        const { password: _pw, ...kaderData } = kader;
        foundUser = { ...kaderData, lastLogin: now };
      }
    }

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('smart_posyandu_user', JSON.stringify(foundUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smart_posyandu_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
