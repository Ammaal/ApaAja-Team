export type OrderStatus = "confirmed" | "completed" | "cancelled";
export type RefundStatus = "requested" | "processing_bank" | "completed";

export interface OrderLeg {
  trainName: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
}

export interface Order {
  id: string;
  trainId: string;
  trainName: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  passengers: number;
  status: OrderStatus;
  price: number;
  refundStatus: RefundStatus | null;
  isAlternative?: boolean;
  legs?: OrderLeg[];
}

export const mockOrders: Order[] = [
  {
    id: "TRX001",
    trainId: "KAI001",
    trainName: "Argo Bromo Anggrek",
    origin: "Jakarta",
    destination: "Surabaya",
    date: "2025-10-20",
    time: "08:00",
    passengers: 2,
    status: "confirmed",
    price: 700000,
    refundStatus: null,
    isAlternative: false,
  },
  {
    id: "TRX002",
    trainId: "KAI002",
    trainName: "Bima",
    origin: "Yogyakarta",
    destination: "Jakarta",
    date: "2025-09-15",
    time: "10:30",
    passengers: 1,
    status: "completed",
    price: 320000,
    refundStatus: "processing_bank",
    isAlternative: false,
  },
  {
    id: "TRX003",
    trainId: "KAI003",
    trainName: "Turangga",
    origin: "Bandung",
    destination: "Surabaya",
    date: "2025-08-10",
    time: "14:00",
    passengers: 3,
    status: "cancelled",
    price: 750000,
    refundStatus: "completed",
    isAlternative: false,
  },
];