const isDevelopment = import.meta.env.DEV;

// Use local URLs in development, production URLs otherwise
export const API_BASE_URL = isDevelopment
    ? 'http://localhost:8080'
    : 'https://credigo-it342.onrender.com';

export const FRONTEND_URL = isDevelopment
    ? 'http://localhost:5173'
    : 'https://credi-go-it-342.vercel.app';
