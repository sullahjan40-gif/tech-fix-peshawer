// Vercel Serverless Adapter
// This file wraps the Express app from server.ts as a Vercel serverless function.
// All API routes, authentication, Firestore, and email features work unchanged.
import 'dotenv/config';
import app from '../server';

export default app;
