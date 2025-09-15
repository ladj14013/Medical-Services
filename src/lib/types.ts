export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  location: string;
  availability: {
    [date: string]: string[];
  };
  bio: string;
  imageId: string;
  status: 'approved' | 'pending' | 'rejected';
  licenseNumber?: string;
  dailyAppointmentLimit?: number;
  promotionalImages?: { id: string; url: string; hint: string }[];
  connections?: string[];
  email?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  doctorName: string;
  doctorSpecialization: string;
  patientName: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  reason?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  medicalHistory: string;
  avatarId: string;
  role: 'patient' | 'doctor' | 'admin';
}

export interface ForumPost {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  authorSpecialization: string;
  date: string;
  content: string;
  comments: ForumComment[];
}

export interface ForumComment {
  id: string;
  authorName: string;
  date: string;
  content: string;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'request' | 'message';
  requestStatus?: 'pending' | 'accepted' | 'rejected';
}
