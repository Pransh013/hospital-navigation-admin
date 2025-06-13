import { HeartPulse, LayoutDashboard, Stethoscope, Users } from "lucide-react";

export const sidebarData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Manage Patients",
      url: "/patients",
      icon: Users,
      items: [
        {
          title: "Add Patient",
          url: "/patients/add",
        },
        {
          title: "Update Patient",
          url: "/patients/update",
        },
      ],
    },
    {
      title: "Manage Doctors",
      url: "/doctors",
      icon: Stethoscope,
      items: [
        {
          title: "Add Doctor",
          url: "/doctors/add",
        },
        {
          title: "Update Doctor",
          url: "/doctors/update",
        },
      ],
    },
    {
      title: "Manage Tests",
      url: "/tests",
      icon: HeartPulse,
      items: [
        {
          title: "Add Tests",
          url: "/tests/add",
        },
      ],
    },
  ],
};

export const AUTH_COOKIE_NAME = "auth_token";
export const TOKEN_EXPIRY_SECONDS = 60 * 60 * 24 * 7;
export const SALT_ROUNDS = 10;

export type Doctor = {
  id: string;
  name: string;
  designation: string;
  availability: "available" | "on-leave";
};

export const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Anjali Mehra",
    designation: "Cardiologist",
    availability: "available",
  },
  {
    id: "d2",
    name: "Dr. Rakesh Yadav",
    designation: "Radiologist",
    availability: "on-leave",
  },
  {
    id: "d3",
    name: "Dr. Sneha Roy",
    designation: "Neurologist",
    availability: "available",
  },
  {
    id: "d4",
    name: "Dr. Vishal Gupta",
    designation: "Orthopedic",
    availability: "available",
  },
  {
    id: "d5",
    name: "Dr. Farah Khan",
    designation: "Pathologist",
    availability: "on-leave",
  },
  {
    id: "d6",
    name: "Dr. Alok Verma",
    designation: "Cardiologist",
    availability: "available",
  },
  {
    id: "d7",
    name: "Dr. Priya Nair",
    designation: "Radiologist",
    availability: "available",
  },
  {
    id: "d8",
    name: "Dr. Rohit Sharma",
    designation: "Orthopedic",
    availability: "on-leave",
  },
  {
    id: "d9",
    name: "Dr. Meenakshi Das",
    designation: "Neurologist",
    availability: "available",
  },
  {
    id: "d10",
    name: "Dr. Harsh Singh",
    designation: "Pathologist",
    availability: "available",
  },
];
