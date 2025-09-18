// User entity for database layer
export interface UserEntity {
  id: string;
  email: string;
  userName: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  configStep: string; // Database stores as string
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Partial user entity for updates
export type PartialUserEntity = Partial<UserEntity>;