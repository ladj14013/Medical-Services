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
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface User {
  id: string;
  name: string;
  email: string;
  medicalHistory: string;
  avatarId: string;
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
