import {
  HeartPulse,
  LayoutDashboard,
  Package,
  Stethoscope,
  Users,
} from "lucide-react";

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
          title: "Patient Actions",
          url: "/patients/actions",
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
    {
      title: "Manage Packages",
      url: "/packages",
      icon: Package,
      items: [
        {
          title: "Add Package",
          url: "/packages/add",
        },
      ],
    },
  ],
};

export const AUTH_COOKIE_NAME = "auth_token";
export const TOKEN_EXPIRY_SECONDS = 60 * 60 * 24 * 7;
export const SALT_ROUNDS = 10;
