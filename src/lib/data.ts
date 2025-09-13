import type { Doctor, Appointment, User } from './types';

export const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Evelyn Reed',
    specialization: 'Cardiology',
    location: 'Springfield, IL',
    availability: {
      [new Date(Date.now() + 86400000).toISOString().split('T')[0]]: ['09:00 AM', '10:00 AM', '02:00 PM'],
      [new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]]: ['09:30 AM', '11:00 AM', '03:00 PM', '04:00 PM'],
    },
    bio: 'Dr. Reed is a board-certified cardiologist with over 15 years of experience in treating heart conditions. She is a fellow of the American College of Cardiology.',
    imageId: 'doctor-1',
  },
  {
    id: '2',
    name: 'Dr. Marcus Thorne',
    specialization: 'Dermatology',
    location: 'Metropolis, NY',
    availability: {
      [new Date(Date.now() + 86400000).toISOString().split('T')[0]]: ['10:30 AM', '11:30 AM', '01:30 PM'],
      [new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]]: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM'],
    },
    bio: 'Dr. Thorne specializes in medical and cosmetic dermatology. He is known for his patient-centric approach and expertise in treating rare skin disorders.',
    imageId: 'doctor-2',
  },
  {
    id: '3',
    name: 'Dr. Anya Sharma',
    specialization: 'Pediatrics',
    location: 'Northville, CA',
    availability: {
      [new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]]: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM'],
      [new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0]]: ['11:00 AM', '11:30 AM', '12:00 PM'],
    },
    bio: 'With a warm and friendly demeanor, Dr. Sharma has been caring for children for over a decade. She believes in holistic care for her young patients.',
    imageId: 'doctor-3',
  },
  {
    id: '4',
    name: 'Dr. Julian Chen',
    specialization: 'Neurology',
    location: 'Springfield, IL',
    availability: {
      [new Date(Date.now() + 86400000).toISOString().split('T')[0]]: ['02:00 PM', '03:00 PM'],
      [new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]]: ['09:00 AM', '10:00 AM'],
    },
    bio: 'Dr. Chen is a leading neurologist focusing on movement disorders and neurodegenerative diseases. He is actively involved in clinical research.',
    imageId: 'doctor-4',
  },
    {
    id: '5',
    name: 'Dr. Sofia Rossi',
    specialization: 'Cardiology',
    location: 'Metropolis, NY',
    availability: {
      [new Date(Date.now() + 86400000).toISOString().split('T')[0]]: ['09:15 AM', '10:15 AM', '02:15 PM'],
      [new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]]: ['09:45 AM', '11:15 AM', '03:15 PM', '04:15 PM'],
    },
    bio: 'Dr. Rossi brings a compassionate approach to cardiac care, specializing in preventative medicine and heart health for women.',
    imageId: 'doctor-5',
  },
  {
    id: '6',
    name: 'Dr. Ben Carter',
    specialization: 'Dermatology',
    location: 'Northville, CA',
    availability: {
      [new Date(Date.now() + 86400000).toISOString().split('T')[0]]: ['10:45 AM', '11:45 AM', '01:45 PM'],
      [new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]]: ['09:15 AM', '10:15 AM', '02:15 PM', '03:15 PM'],
    },
    bio: 'Dr. Carter is a renowned dermatologist focusing on advanced dermatologic surgery and the treatment of skin cancer.',
    imageId: 'doctor-6',
  }
];

export const appointments: Appointment[] = [
  {
    id: 'apt1',
    doctorId: '1',
    doctorName: 'Dr. Evelyn Reed',
    doctorSpecialization: 'Cardiology',
    date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    time: '10:00 AM',
    status: 'upcoming',
  },
  {
    id: 'apt2',
    doctorId: '3',
    doctorName: 'Dr. Anya Sharma',
    doctorSpecialization: 'Pediatrics',
    date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    time: '11:30 AM',
    status: 'upcoming',
  },
];

export const currentUser: User = {
    id: 'user1',
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    medicalHistory: 'No significant medical history. Allergic to penicillin.',
    avatarId: 'user-avatar'
}
