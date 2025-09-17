'use client';

import type { Appointment, Doctor, User } from '@/lib/types';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import Logo from '@/components/logo';

interface PrintableListProps {
    appointments: Appointment[];
    doctor: Doctor;
    date: Date | undefined;
    patient: User; // In a real app, this would be an array of patients
}

export default function PrintableList({ appointments, doctor, date, patient }: PrintableListProps) {
    if (!date) return null;

    return (
        <div className="printable-area p-10 hidden">
            <header className="mb-8">
                <div className='flex justify-between items-center'>
                     <Logo />
                     <div className='text-right'>
                        <h1 className="text-2xl font-bold font-headline">{doctor.name}</h1>
                        <p className="text-muted-foreground">{doctor.specialization}</p>
                    </div>
                </div>
                <div className="text-center mt-6">
                    <h2 className="text-xl font-semibold">قائمة المرضى ليوم: {format(date, 'd MMMM yyyy', { locale: ar })}</h2>
                </div>
            </header>
            <main>
                <table className="w-full text-right border-collapse">
                    <thead>
                        <tr className='border-b-2 border-primary'>
                            <th className="p-2 border">الرقم</th>
                            <th className="p-2 border">الاسم واللقب</th>
                            <th className="p-2 border">رقم الهاتف</th>
                            <th className="p-2 border">سبب الزيارة</th>
                            <th className="p-2 border">الوقت</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((apt, index) => (
                            <tr key={apt.id} className="border-b">
                                <td className="p-2 border">{index + 1}</td>
                                <td className="p-2 border">{apt.patientName}</td>
                                <td className="p-2 border">{patient.phoneNumber}</td> {/* This is still a placeholder */}
                                <td className="p-2 border">{apt.reason || 'غير محدد'}</td>
                                <td className="p-2 border">{apt.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
             <footer className="mt-8 text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} Medical Services. كل الحقوق محفوظة.
            </footer>
        </div>
    );
}
