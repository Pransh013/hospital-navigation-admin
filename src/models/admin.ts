export interface Admin {
  adminId: string; // Partition Key
  email: string; // GSI
  passwordHash: string;
  firstName: string;
  lastName: string;
  hospitalId: string; // tenant Id
  createdAt: string;
  updatedAt: string;
}
