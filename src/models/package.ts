export interface Package {
  packageId: string; // Partition Key
  hospitalId: string; // GSI
  name: string;
  description?: string;
  testIds: string[];
  price: number;
  createdAt: string;
  updatedAt: string;
}
