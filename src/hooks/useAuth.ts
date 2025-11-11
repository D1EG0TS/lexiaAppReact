import { useContext } from 'react';
import { useAuthContext } from '../context/AuthContext';

export const useAuth = () => useAuthContext();