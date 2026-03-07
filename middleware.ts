import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // Protects all routes except api, _next static files, and images
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
