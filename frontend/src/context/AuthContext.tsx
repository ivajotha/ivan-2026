import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const activeSession = localStorage.getItem('snail_active_session');
    if (activeSession) {
      setUser(JSON.parse(activeSession));
    }
    setLoading(false);
  }, []);


  const registerUser = (fullName: string, email: string, password: string) => {
  
    const existingUser = localStorage.getItem(`user_${email}`);
    if (existingUser) {
      return { success: false, message: 'El correo ya está registrado.' };
    }

    const newUser: UserProfile = {
      id: `usr_${Math.floor(1000 + Math.random() * 9000)}`,
      fullName,
      email,
      balance: 0 
    };

    
    localStorage.setItem(`user_${email}`, JSON.stringify({ ...newUser, password }));
    
    return { success: true, message: 'Usuario registrado exitosamente.' };
  };

   
  const loginUser = (email: string, password: string) => {
    
    if (email === 'ivan@test.com' && password === '123456') {
      const defaultSession: UserProfile = {
        id: 'usr_2026',
        fullName: 'Ivan Juarez',
        email: 'ivan@test.com',
        balance: 0 
      };
      setUser(defaultSession);
      localStorage.setItem('snail_active_session', JSON.stringify(defaultSession));
      return { success: true, message: 'Login correcto.' };
    }

    const rawUserData = localStorage.getItem(`user_${email}`);
    if (!rawUserData) {
      return { success: false, message: 'Credenciales inválidas.' };
    }

    const savedUser = JSON.parse(rawUserData);
    if (savedUser.password !== password) {
      return { success: false, message: 'Credenciales inválidas.' };
    }

    const userSession: UserProfile = {
      id: savedUser.id,
      fullName: savedUser.fullName,
      email: savedUser.email,
      balance: savedUser.balance
    };

    setUser(userSession);
    localStorage.setItem('snail_active_session', JSON.stringify(userSession));
    return { success: true, message: 'Login correcto.' };
  };


  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('snail_active_session');
  };

  const updateBalance = (amount: number) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      balance: user.balance + amount
    };

    setUser(updatedUser);
    localStorage.setItem('snail_active_session', JSON.stringify(updatedUser));

    const rawUserData = localStorage.getItem(`user_${user.email}`);
    if (rawUserData) {
      const savedUser = JSON.parse(rawUserData);
      savedUser.balance = savedUser.balance + amount;
      localStorage.setItem(`user_${user.email}`, JSON.stringify(savedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, registerUser, loginUser, logoutUser, updateBalance }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
