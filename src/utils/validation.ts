import { z } from 'zod';

export const emailSchema = z.string().email('Email inválido');
export const passwordSchema = z.string().min(6, 'La contraseña debe tener al menos 6 caracteres');
export const roleSchema = z.enum(['user', 'admin']);