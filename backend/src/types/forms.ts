export interface ContactRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface QuoteRequest {
  firstName: string;
  lastName: string;
  departure: string;
  arrival: string;
  passengers: string;
  tripType: string;
  phone: string;
  email: string;
  note: string;
}

export interface AppointmentRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  subject: string;
  notes: string;
  selectedDateLabel: string;
  selectedSlot: string;
}
