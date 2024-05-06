import express from 'express';
import { Session } from 'express-session';
import { ObjectId } from 'mongoose';

declare module 'express-session' {
  interface Session {
    passport: {
      user: string;
    };
  }
}

declare global {
  namespace Express {
    interface User {
      _id: string;
    }
  }
}
