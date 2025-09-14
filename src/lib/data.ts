import type { Doctor, Appointment, User, ForumPost, Message } from './types';

export const doctors: Doctor[] = [
  {
    id: '1',
    name: 'د. إيفلين ريد',
    specialization: 'طب القلب',
    location: 'سبرينغفيلد، إلينوي',
    availability: {
      [new Date(Date.now() + 86400000).toISOString().split('T')[0]]: ['09:00 ص', '10:00 ص', '02:00 م'],
      [new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]]: ['09:30 ص', '11:00 ص', '03:00 م', '04:00 م'],
      [new Date().toISOString().split('T')[0]]: ['09:00 ص', '10:00 ص', '11:00 ص'],
    },
    bio: 'د. ريد طبيبة قلب معتمدة من البورد ولديها أكثر من 15 عامًا من الخبرة في علاج أمراض القلب. وهي زميلة في الكلية الأمريكية لأمراض القلب.',
    imageId: 'doctor-1',
    status: 'approved',
    dailyAppointmentLimit: 10,
    promotionalImages: [
        { id: 'promo-1', url: 'https://picsum.photos/seed/promo1/600/400', hint: 'clinic interior' },
        { id: 'promo-2', url: 'https://picsum.photos/seed/promo2/600/400', hint: 'medical equipment' },
    ],
    connections: ['2'],
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
    dailyAppointmentLimit: 8,
    promotionalImages: [
        { id: 'promo-3', url: 'https://picsum.photos/seed/promo3/600/400', hint: 'waiting room' },
    ],
    connections: ['1'],
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
    dailyAppointmentLimit: 12,
     promotionalImages: [],
     connections: [],
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
    dailyAppointmentLimit: 5,
    promotionalImages: [
        { id: 'promo-1', url: 'https://picsum.photos/seed/promo1/600/400', hint: 'clinic interior' },
    ],
    connections: [],
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
    dailyAppointmentLimit: 10,
    promotionalImages: [],
    connections: [],
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
    dailyAppointmentLimit: 9,
    promotionalImages: [],
    connections: [],
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
    id: 'apt0',
    doctorId: '1',
    doctorName: 'د. إيفلين ريد',
    doctorSpecialization: 'طب القلب',
    date: new Date().toISOString().split('T')[0],
    time: '09:00 ص',
    status: 'upcoming',
    reason: 'فحص روتيني',
  },
  {
    id: 'apt1',
    doctorId: '1',
    doctorName: 'د. إيفلين ريد',
    doctorSpecialization: 'طب القلب',
    date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    time: '10:00 ص',
    status: 'upcoming',
    reason: 'استشارة متابعة',
  },
  {
    id: 'apt2',
    doctorId: '3',
    doctorName: 'د. أنيا شارما',
    doctorSpecialization: 'طب الأطفال',
    date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    time: '11:30 ص',
    status: 'upcoming',
    reason: 'تطعيمات',
  },
];

export const currentUser: User = {
    id: 'user1',
    name: 'أليكس دو',
    email: 'alex.doe@example.com',
    phoneNumber: '555-123-4567',
    medicalHistory: 'لا يوجد تاريخ طبي مهم. حساسية من البنسلين.',
    avatarId: 'user-avatar'
}

export const forumPosts: ForumPost[] = [
    {
      id: 'post1',
      title: 'دراسة حالة مثيرة للاهتمام: عدم انتظام ضربات القلب النادر',
      authorId: '1',
      authorName: 'د. إيفلين ريد',
      authorSpecialization: 'طب القلب',
      date: '2024-05-20T10:00:00Z',
      content: 'واجهت حالة فريدة اليوم لمريض يبلغ من العمر 45 عامًا يعاني من نوع نادر من عدم انتظام ضربات القلب. أظهر مخطط كهربية القلب نمطًا غير عادي لم أره منذ إقامتي. هل واجه أي شخص شيئًا مشابهًا؟ أرفقت مخطط كهربية القلب (مع إخفاء هوية المريض) للمراجعة.',
      comments: [
        { id: 'c1', authorName: 'د. جوليان تشين', date: '2024-05-20T12:30:00Z', content: 'مثير للاهتمام جدًا يا د. ريد. يبدو مشابهًا لحالة رأيتها أثناء تدريبي. هل فكرت في إجراء دراسة فيزيولوجيا كهربية؟' },
        { id: 'c2', authorName: 'د. صوفيا روسي', date: '2024-05-21T09:15:00Z', content: 'شكرًا لمشاركة هذا. يمكن أن يكون هذا مرتبطًا بمتلازمة وراثية معينة. قد يكون الاختبار الجيني مفيدًا.' },
      ]
    },
    {
      id: 'post2',
      title: 'أفضل الممارسات لإدارة الأكزيما عند الأطفال',
      authorId: '3',
      authorName: 'د. أنيا شارما',
      authorSpecialization: 'طب الأطفال',
      date: '2024-05-18T14:00:00Z',
      content: 'أبحث عن مناقشة حول أحدث البروتوكولات والاستراتيجيات لإدارة الأكزيما الشديدة في مرضى الأطفال. ما هي العلاجات الموضعية والمجموعية التي وجدتم أنها الأكثر فعالية؟ أي نصائح لإدارة نوبات الحكة؟',
      comments: [
         { id: 'c3', authorName: 'د. ماركوس ثورن', date: '2024-05-19T11:00:00Z', content: 'موضوع رائع يا د. شارما. في ممارستي، وجدت أن العلاج الاستباقي باستخدام الكورتيكوستيرويدات الموضعية منخفضة الفعالية مرتين في الأسبوع يكون فعالًا جدًا في منع النوبات. كما أن العلاج بالضوء يعد خيارًا جيدًا للحالات المقاومة للعلاج.' },
      ]
    }
  ];

  export const messages: Message[] = [
    {
        id: 'msg1',
        senderId: '3',
        recipientId: '1',
        senderName: 'د. أنيا شارما',
        content: 'مرحباً د. ريد، أود التواصل لمناقشة حالة مريض مشترك.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        read: false,
        type: 'request',
        requestStatus: 'pending',
    },
    {
        id: 'msg2',
        senderId: '4',
        recipientId: '1',
        senderName: 'د. جوليان تشين',
        content: 'بخصوص دراسة الحالة في المنتدى، لدي بعض الأفكار التي أود مشاركتها.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        type: 'request',
        requestStatus: 'pending',
    },
    {
        id: 'msg3',
        senderId: '2',
        recipientId: '1',
        senderName: 'د. ماركوس ثورن',
        content: 'شكرًا على قبول طلب التواصل!',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        read: true,
        type: 'message',
    }
  ]
