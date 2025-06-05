export interface User {
  userId: string;
  email: string;
  passwordHash: string;
  role: "admin" | "patient";
  firstName: string;
  lastName: string;
  hospitalId: string;
  createdAt: string;
  updatedAt: string;
}
