export interface Test {
  testId: string; // Partition Key
  hospitalId: string; // GSI
  name: string;
  description?: string;
  price: number;
  category?: string;
  roomNumber?: string;
  floorNumber?: string;
  status: "active" | "on-break" | "closed";
  patientsWaiting: number;
  createdAt: string;
  updatedAt: string;
}
