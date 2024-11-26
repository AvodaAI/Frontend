import { InferModel } from 'drizzle-orm';
import { users, sessions } from './schema';

// Explicitly define User type with string id
export type User = Omit<InferModel<typeof users>, 'id'> & { id: string };
export type NewUser = Omit<InferModel<typeof users, 'insert'>, 'id'> & { id?: string };

export type Session = InferModel<typeof sessions>;
export type NewSession = InferModel<typeof sessions, 'insert'>;
