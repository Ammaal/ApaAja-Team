export interface Train {
  id: string;
  name: string;
  route: string;
  departureTime: string;
  status: "On Time" | "Delayed" | "Cancelled";
  delayInfo?: string;
}

export const mockTrains: Train[] = [
  {
    id: "T001",
    name: "Argo Bromo Anggrek",
    route: "Jakarta - Surabaya",
    departureTime: "08:00",
    status: "Delayed",
    delayInfo: "Technical maintenance at the main station. The train is expected to depart at 09:30.",
  },
  {
    id: "T002",
    name: "Bima",
    route: "Yogyakarta - Jakarta",
    departureTime: "10:30",
    status: "On Time",
  },
  {
    id: "T003",
    name: "Turangga",
    route: "Bandung - Surabaya",
    departureTime: "14:00",
    status: "On Time",
  },
  {
    id: "T004",
    name: "Gajayana",
    route: "Malang - Jakarta",
    departureTime: "16:00",
    status: "On Time",
  },
];