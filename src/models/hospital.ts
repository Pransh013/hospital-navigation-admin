export interface Hospital {
  hospitalId: string; // Partition Key
  hospitalName: string; // GSI
  address?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}
