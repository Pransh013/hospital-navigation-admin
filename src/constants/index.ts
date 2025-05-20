import {
  Bot,
  SquareTerminal,
} from "lucide-react";

export const hospitalList = [
  { value: "city_hospital", label: "City Hospital" },
  { value: "green_valley_medical", label: "Green Valley Medical" },
  { value: "sunrise_health_clinic", label: "Sunrise Health Clinic" },
  { value: "riverdale_general", label: "Riverdale General" },
];

export const sidebarData = {
  user: {
    name: "Pranshu Verma",
    email: "pranshuverma@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
  ],
};

type DiagnosticTest = {
  id: string;
  name: string;
  patientsWaiting: number;
  status: "active" | "closed" | "on-break";
};

export const diagnosticTests: DiagnosticTest[] = [
  {
    id: "test_001",
    name: "Blood Sample",
    patientsWaiting: 12,
    status: "active",
  },
  {
    id: "test_002",
    name: "TMT (Treadmill Test)",
    patientsWaiting: 5,
    status: "on-break",
  },
  {
    id: "test_003",
    name: "ECG",
    patientsWaiting: 8,
    status: "active",
  },
  {
    id: "test_004",
    name: "X-ray",
    patientsWaiting: 3,
    status: "closed",
  },
  {
    id: "test_005",
    name: "Ultrasound",
    patientsWaiting: 7,
    status: "active",
  },
  {
    id: "test_006",
    name: "MRI",
    patientsWaiting: 0,
    status: "on-break",
  },
  {
    id: "test_007",
    name: "CT Scan",
    patientsWaiting: 4,
    status: "active",
  },
  {
    id: "test_008",
    name: "Urine Test",
    patientsWaiting: 6,
    status: "active",
  },
];

export const patients = [
  {
    id: "p1",
    name: "Alice Johnson",
    joinedAt: "09:30 AM",
    date: "2025-05-06",
    test: "ECG",
  },
  {
    id: "p2",
    name: "Bob Smith",
    joinedAt: "10:00 AM",
    date: "2025-05-06",
    test: "TMT",
  },
  {
    id: "p3",
    name: "Carol Danvers",
    joinedAt: "09:45 AM",
    date: "2025-05-06",
    test: "ECG",
  },
  {
    id: "p4",
    name: "David Roe",
    joinedAt: "10:15 AM",
    date: "2025-05-06",
    test: "Xray",
  },
];

export const patientRecords = [
  {
    id: "P001",
    name: "Alice Johnson",
    testName: "ECG",
    date: "2025-05-06",
    reportUploaded: true,
    doctorAssigned: true,
  },
  {
    id: "P002",
    name: "Bob Smith",
    testName: "TMT",
    date: "2025-05-06",
    reportUploaded: false,
    doctorAssigned: false,
  },
  {
    id: "P003",
    name: "Carol Danvers",
    testName: "Xray",
    date: "2025-05-05",
    reportUploaded: true,
    doctorAssigned: true,
  },
];


export type Doctor = {
  id: string;
  name: string;
  designation: string;
  hospital: string;
  availability: "available" | "on-leave";
};

// constants/doctors.ts
export const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Anjali Mehra",
    designation: "Cardiologist",
    hospital: "Apollo Hospital",
    availability: "available",
  },
  {
    id: "d2",
    name: "Dr. Rakesh Yadav",
    designation: "Radiologist",
    hospital: "Fortis Hospital",
    availability: "on-leave",
  },
  {
    id: "d3",
    name: "Dr. Sneha Roy",
    designation: "Neurologist",
    hospital: "AIIMS",
    availability: "available",
  },
  {
    id: "d4",
    name: "Dr. Vishal Gupta",
    designation: "Orthopedic",
    hospital: "Max Healthcare",
    availability: "available",
  },
  {
    id: "d5",
    name: "Dr. Farah Khan",
    designation: "Pathologist",
    hospital: "Medanta",
    availability: "on-leave",
  },
  {
    id: "d6",
    name: "Dr. Alok Verma",
    designation: "Cardiologist",
    hospital: "Apollo Hospital",
    availability: "available",
  },
  {
    id: "d7",
    name: "Dr. Priya Nair",
    designation: "Radiologist",
    hospital: "Fortis Hospital",
    availability: "available",
  },
  {
    id: "d8",
    name: "Dr. Rohit Sharma",
    designation: "Orthopedic",
    hospital: "AIIMS",
    availability: "on-leave",
  },
  {
    id: "d9",
    name: "Dr. Meenakshi Das",
    designation: "Neurologist",
    hospital: "Max Healthcare",
    availability: "available",
  },
  {
    id: "d10",
    name: "Dr. Harsh Singh",
    designation: "Pathologist",
    hospital: "Medanta",
    availability: "available",
  },
];

