import { Timestamp } from "firebase/firestore";

// ==================== 기본 타입 정의 ====================

export type ServiceCategory =
  | "cut"
  | "color"
  | "perm"
  | "treatment"
  | "styling";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no-show";
export type StylistLevel = "junior" | "senior" | "master" | "director";

// 알림 타입 별도 정의 (중요!)
export type NotificationType = "success" | "error" | "info" | "warning";

// ==================== 사용자 관련 ====================

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;

  // 고객 기본 정보
  preferences?: {
    preferredStylistId?: string; // 선호 미용사
    notes?: string; // 특이사항 (알레르기 등)
  };

  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// ==================== 미용사 관련 ====================

export interface Stylist {
  id: string;
  name: string;
  profileImage?: string;
  level: StylistLevel; // 미용사 등급
  experience: number; // 경력 년수
  introduction: string; // 소개글
  isActive: boolean; // 현재 근무 중인지

  // 근무 스케줄
  workingDays: string[]; // ['monday', 'tuesday', 'wednesday']
  workingHours: {
    start: string; // '09:00'
    end: string; // '18:00'
  };

  // 휴게시간
  breakTime?: {
    start: string; // '12:00'
    end: string; // '13:00'
  };

  // 가격 정책 (미용사별 다른 가격 적용 가능)
  defaultPriceMultiplier: number; // 1.0 = 기본가격, 1.2 = 20% 할증

  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// 미용사 휴가/부재 관리
export interface StylistLeave {
  id: string;
  stylistId: string;
  startDate: string; // 'YYYY-MM-DD'
  endDate: string; // 'YYYY-MM-DD'
  reason: string; // '연차', '병가', '교육'
  isFullDay: boolean; // 종일 휴가 여부

  // 부분 휴가의 경우
  startTime?: string; // 'HH:mm'
  endTime?: string; // 'HH:mm'

  createdAt: Timestamp | Date;
}

// ==================== 서비스 관련 (간단한 방식) ====================

export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  duration: number; // 기본 소요시간 (분)
  price: number; // 기본 가격
  minimumLevel: StylistLevel; // 최소 요구 레벨
  isActive: boolean;

  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// ==================== 서비스-미용사 관계 테이블 ====================

export interface ServiceStylist {
  id: string;
  serviceId: string;
  stylistId: string;

  // 미용사별 개별 설정
  isAvailable: boolean; // 이 미용사가 이 서비스 제공 가능한지
  customPrice?: number; // 개별 가격 (설정 시 기본가격 무시)
  customDuration?: number; // 개별 소요시간
  specialNote?: string; // 특별 안내사항 ("원장님 전용 메뉴")

  // 비정규화 (조회 성능)
  serviceName: string;
  stylistName: string;

  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// ==================== 예약 관련 ====================

export interface Booking {
  id: string;

  // 고객 정보
  userId?: string; // 회원 ID (비회원 가능)
  customerName: string;
  customerPhone: string;
  customerEmail?: string;

  // 미용사 정보
  stylistId: string;
  stylistName: string; // 비정규화 (조회 성능)

  // 서비스 정보
  serviceId: string;
  serviceName: string; // 비정규화

  // 예약 일시
  date: string; // 'YYYY-MM-DD'
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm' (계산된 종료시간)

  // 실제 적용된 값들 (예약 시점 기준)
  duration: number; // 실제 소요시간
  price: number; // 실제 적용 가격

  // 예약 상태
  status: BookingStatus;
  notes?: string; // 요청사항

  // 리마인더 정보
  reminderSent: boolean; // 알림 발송 여부

  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// ==================== 영업시간 관련 ====================

export interface BusinessHours {
  dayOfWeek: string; // 'monday', 'tuesday', ...
  isOpen: boolean;
  openTime?: string; // 'HH:mm'
  closeTime?: string; // 'HH:mm'

  // 공통 휴게시간 (개별 미용사 휴게시간과 별도)
  breakTimes?: {
    start: string;
    end: string;
    reason: string; // '점심시간', '청소시간'
  }[];
}

export interface Holiday {
  date: string; // 'YYYY-MM-DD'
  reason: string;
  isRecurring: boolean; // 매년 반복 여부 (설날, 추석 등)
}

// ==================== 예약 가능 시간 계산용 ====================

export interface TimeSlot {
  time: string; // 'HH:mm'
  isAvailable: boolean;
  isBooked: boolean;
  bookingId?: string;
  stylistId?: string; // 어떤 미용사의 슬롯인지
}

export interface StylistSchedule {
  stylistId: string;
  stylistName: string;
  date: string; // 'YYYY-MM-DD'
  timeSlots: TimeSlot[];
  isWorkingDay: boolean;
  totalBookings: number; // 해당일 예약 건수
}

// ==================== 미용실 설정 ====================

export interface SalonSettings {
  name: string;
  address: string;
  phone: string;

  // 예약 정책
  bookingPolicy: {
    advanceBookingDays: number; // 몇 일 전까지 예약 가능
    cancellationHours: number; // 몇 시간 전까지 취소 가능
    reminderHours: number; // 몇 시간 전에 알림 발송
    noShowPenalty: boolean; // 노쇼 패널티 적용 여부
  };

  // 운영 정보
  timeSlotInterval: number; // 예약 가능한 시간 간격 (분, 예: 30분)
  bufferTime: number; // 예약 간 버퍼 시간 (분, 예: 15분)

  updatedAt: Timestamp | Date;
}

// ==================== API 응답용 조합 타입 ====================

// 특정 미용사가 제공 가능한 서비스 (조회 최적화)
export interface StylistService {
  serviceId: string;
  serviceName: string;
  serviceCategory: ServiceCategory;
  description: string;

  // 이 미용사 기준의 실제 적용값
  actualPrice: number; // customPrice || (price * priceMultiplier)
  actualDuration: number; // customDuration || duration
  specialNote?: string;

  isAvailable: boolean;
}

// 특정 서비스를 제공할 수 있는 미용사 목록
export interface ServiceProvider {
  stylistId: string;
  stylistName: string;
  stylistLevel: StylistLevel;
  profileImage?: string;

  // 이 서비스에 대한 미용사별 정보
  price: number;
  duration: number;
  specialNote?: string;

  // 가용성 정보
  isAvailable: boolean;
  nextAvailableTime?: string; // 다음 가능한 시간
}

// ==================== Zustand Store 타입 ====================

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
  updateProfile: (userData: Partial<User>) => Promise<void>;
  setUser: (user: User | null) => void;
  subscribeToAuth: () => () => void;
}

export interface StylistStore {
  stylists: Stylist[];
  selectedStylist: Stylist | null;
  stylistSchedules: StylistSchedule[];
  isLoading: boolean;

  // 데이터 조회
  fetchStylists: () => Promise<void>;
  fetchStylistSchedule: (stylistId: string, date: string) => Promise<void>;
  getAvailableStylists: (serviceId: string) => ServiceProvider[];

  // 선택
  setSelectedStylist: (stylist: Stylist | null) => void;

  // 실시간 구독
  subscribeToStylists: () => () => void;
}

export interface ServiceStore {
  services: Service[];
  serviceStylist: ServiceStylist[]; // 관계 데이터
  selectedService: Service | null;
  availableProviders: ServiceProvider[]; // 선택된 서비스의 제공 가능 미용사
  isLoading: boolean;

  // 조회 함수들
  fetchServices: () => Promise<void>;
  fetchServiceStylistRelations: () => Promise<void>;

  // 필터링 함수들
  getServicesByCategory: (category: ServiceCategory) => Service[];
  getServicesByStylist: (stylistId: string) => StylistService[];
  getAvailableProviders: (serviceId: string) => ServiceProvider[];
  getStylistServiceInfo: (
    serviceId: string,
    stylistId: string
  ) => ServiceStylist | null;

  // 가격/시간 계산
  calculatePrice: (serviceId: string, stylistId: string) => number;
  calculateDuration: (serviceId: string, stylistId: string) => number;

  // 선택 상태
  setSelectedService: (service: Service | null) => void;

  // 실시간 구독
  subscribeToServices: () => () => void;
  subscribeToServiceStylistRelations: () => () => void;
}

export interface BookingStore {
  bookings: Booking[];
  selectedDate: string; // 'YYYY-MM-DD'
  selectedService: Service | null;
  selectedStylist: Stylist | null;
  availableSlots: { [stylistId: string]: TimeSlot[] };
  isLoading: boolean;

  // 예약 관리
  fetchBookings: (date?: string, stylistId?: string) => Promise<void>;
  createBooking: (
    booking: Omit<Booking, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<void>;
  cancelBooking: (id: string, reason?: string) => Promise<void>;

  // 가용성 확인
  checkAvailability: (
    stylistId: string,
    date: string,
    startTime: string,
    duration: number
  ) => Promise<boolean>;
  getAvailableSlots: (
    stylistId: string,
    date: string,
    serviceId: string
  ) => Promise<TimeSlot[]>;

  // 상태 관리
  setSelectedDate: (date: string) => void;
  setSelectedService: (service: Service | null) => void;
  setSelectedStylist: (stylist: Stylist | null) => void;

  // 실시간 구독
  subscribeToBookings: (date: string, stylistId?: string) => () => void;
}

// 알림 인터페이스 별도 정의
export interface NotificationData {
  type: NotificationType;
  message: string;
  duration?: number;
}

export interface UIStore {
  // 스텝별 예약 진행상태
  bookingStep: "service" | "stylist" | "datetime" | "info" | "confirm";

  // 모달 상태
  loginModalOpen: boolean;
  bookingModalOpen: boolean;
  stylistModalOpen: boolean;

  // 알림 (수정됨)
  notification: NotificationData | null;

  // 로딩
  globalLoading: boolean;

  // 액션
  setBookingStep: (step: UIStore["bookingStep"]) => void;
  setLoginModalOpen: (open: boolean) => void;
  setBookingModalOpen: (open: boolean) => void;
  setStylistModalOpen: (open: boolean) => void;
  showNotification: (
    type: NotificationType, // 수정됨
    message: string,
    duration?: number
  ) => void;
  hideNotification: () => void;
  setGlobalLoading: (loading: boolean) => void;
}

// ==================== API 함수용 타입 ====================

export interface CreateBookingRequest {
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  stylistId: string;
  serviceId: string;
  date: string;
  startTime: string;
  notes?: string;
}

export interface UpdateBookingRequest {
  date?: string;
  startTime?: string;
  notes?: string;
  status?: BookingStatus;
}

// ==================== 헬퍼 타입 ====================

export type FirestoreDocument<T> = T & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type ClientDocument<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};
