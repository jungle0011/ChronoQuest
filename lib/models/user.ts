import { Plan } from '../pricing';

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  plan: Plan;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInput {
  name?: string;
  email?: string;
  image?: string;
  plan?: Plan;
} 