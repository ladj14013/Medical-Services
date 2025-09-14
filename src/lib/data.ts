import type { Doctor, Appointment, User } from './types';

export const doctors: Doctor[] = [
  {
    id: '1',
    name: 'د. إيفلين ريد',
    specialization: 'طب القلب',
    location: 'سبرينغفيلد، إلينوي',
    availability: {
      [new Date(Date.now() + 86400000).toISOString().split('T')[0]]: ['09:00 ص', '10:00 ص', '02:00 م'],
      [new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]]: ['09:30 ص', '11:00 ص', '03:00 م', '04:00 م'],
    },
    bio: 'د. ريد طبيبة قلب معتمدة من البورد ولديها أكثر من 15 عامًا من الخبرة في علاج أمراض القلب. وهي زميلة في الكلية الأمريكية لأمراض القلب.',
    imageId: 'doctor-1',
    status: 'approved',
  },
  {
    id: '2',
    name: 'د. ماركوس ثورن',
    specialization: 'الأمراض الجلدية',
    location: 'متروبوليس، نيويورك',
    availability: {
      [new Date(Date.now() + 86400000).toISOString().split('T')[0]]: ['10:30 ص', '11:30 ص', '01:30 م'],
      [new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]]: ['09:00 ص', '10:00 ص', '02:00 م', '03:00 م'],
    },
    bio: 'يتخصص د. ثورن في الأمراض الجلدية الطبية والتجميلية. وهو معروف بنهجه الذي يركز على المريض وخبرته في علاج الاضطرابات الجلدية النادرة.',
    imageId: 'doctor-2',
    status: 'approved',
  },
  {
    id: '3',
    name: 'د. أنيا شارما',
    specialization: 'طب الأطفال',
    location: 'نورثفيل، كاليفورنيا',
    availability: {
      [new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]]: ['09:00 ص', '09:30 ص', '10:00 ص', '10:30 ص'],
      [new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0]]: ['11:00 ص', '11:30 ص', '12:00 م'],
    },
    bio: 'بسلوكها الدافئ والودي، تعتني الدكتورة شارما بالأطفال منذ أكثر من عقد. تؤمن بالرعاية الشاملة لمرضاها الصغار.',
    imageId: 'doctor-3',
    status: 'approved',
  },
  {
    id: '4',
    name: 'د. جوليان تشين',
    specialization: 'طب الأعصاب',
    location: 'سبرينغفيلد، إلينوي',
    availability: {
      [new Date(Date.now() + 86400000).toISOString().split('T')[0]]: ['02:00 م', '03:00 م'],
      [new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]]: ['09:00 ص', '10:00 ص'],
    },
    bio: 'الدكتور تشين هو طبيب أعصاب رائد يركز على اضطرابات الحركة والأمراض التنكسية العصبية. يشارك بنشاط في الأبحاث السريرية.',
    imageId: 'doctor-4',
    status: 'approved',
  },
    {
    id: '5',
    name: 'د. صوفيا روسي',
    specialization: 'طب القلب',
    location: 'متروبوليس، نيويورك',
    availability: {
      [new Date(Date.now() + 86400000).toISOString().split('T')[0]]: ['09:15 ص', '10:15 ص', '02:15 م'],
      [new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]]: ['09:45 ص', '11:15 ص', '03:15 م', '04:15 م'],
    },
    bio: 'تقدم الدكتورة روسي نهجًا رحيمًا في رعاية القلب، وهي متخصصة في الطب الوقائي وصحة القلب للمرأة.',
    imageId: 'doctor-5',
    status: 'approved',
  },
  {
    id: '6',
    name: 'د. بن كارتر',
    specialization: 'الأمراض الجلدية',
    location: 'نورثفيل، كاليفورنيا',
    availability: {
      [new Date(Date.now() + 86400000).toISOString().split('T')[0]]: ['10:45 ص', '11:45 ص', '01:45 م'],
      [new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]]: ['09:15 ص', '10:15 ص', '02:15 م', '03:15 م'],
    },
    bio: 'الدكتور كارتر طبيب أمراض جلدية مشهور يركز على جراحة الجلد المتقدمة وعلاج سرطان الجلد.',
    imageId: 'doctor-6',
    status: 'approved',
  },
   {
    id: '7',
    name: 'د. ليلى حسن',
    specialization: 'طب النساء والتوليد',
    location: 'سيتي سنتر، تكساس',
    availability: {},
    bio: 'طبيبة نساء وتوليد ذات خبرة تنتظر الموافقة للانضمام إلى منصتنا.',
    imageId: 'doctor-7',
    status: 'pending',
    licenseNumber: 'MD-789123'
  },
  {
    id: '8',
    name: 'د. عمر فاروق',
    specialization: 'جراحة العظام',
    location: 'ريفرسايد، واشنطن',
    availability: {},
    bio: 'جراح عظام متخصص في الإصابات الرياضية في انتظار المراجعة.',
    imageId: 'doctor-8',
    status: 'pending',
    licenseNumber: 'MD-456789'
  }
];

export const appointments: Appointment[] = [
  {
    id: 'apt1',
    doctorId: '1',
    doctorName: 'د. إيفلين ريد',
    doctorSpecialization: 'طب القلب',
    date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    time: '10:00 ص',
    status: 'upcoming',
  },
  {
    id: 'apt2',
    doctorId: '3',
    doctorName: 'د. أنيا شارما',
    doctorSpecialization: 'طب الأطفال',
    date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    time: '11:30 ص',
    status: 'upcoming',
  },
];

export const currentUser: User = {
    id: 'user1',
    name: 'أليكس دو',
    email: 'alex.doe@example.com',
    medicalHistory: 'لا يوجد تاريخ طبي مهم. حساسية من البنسلين.',
    avatarId: 'user-avatar'
}
