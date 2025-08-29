// User Types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Service Types
export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number;
  category: ServiceCategory;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ServiceCategory =
  | "cut"
  | "color"
  | "perm"
  | "treatment"
  | "styling";

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  serviceName: string;
  date: Date;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  duration: number; // minutes
  price: number;
  status: BookingStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no-show";

// Time Slot Types
export interface TimeSlot {
  time: string; // HH:mm format
  isAvailable: boolean;
  isBooked: boolean;
  bookingId?: string;
}

export interface DaySchedule {
  date: Date;
  timeSlots: TimeSlot[];
  isWorkingDay: boolean;
}

// Store Types (for Zustand)
export interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    userData: Partial<User>
  ) => Promise<void>;
  setUser: (user: User | null) => void;
}

export interface BookingStore {
  bookings: Booking[];
  selectedDate: Date;
  isLoading: boolean;
  fetchBookings: () => Promise<void>;
  createBooking: (
    booking: Omit<Booking, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  setSelectedDate: (date: Date) => void;
}
