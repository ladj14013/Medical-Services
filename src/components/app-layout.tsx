'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  LayoutGrid,
  LogIn,
  Search,
  UserPlus,
  User as UserIcon,
  ChevronUp,
  ChevronDown,
  LogOut,
  MessageSquare,
  Home,
  Settings,
  Mail,
} from 'lucide-react';
import Image from 'next/image';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { currentUser, doctors as allDoctors, messages as allMessages } from '@/lib/data';
import Logo from '@/components/logo';
import data from '@/lib/placeholder-images.json';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SearchDialog from './doctors/search-dialog';
import { doctors } from '@/lib/data';
import RegisterAsDialog from './auth/register-as-dialog';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

const userAvatar = data.placeholderImages.find(
  (img) => img.id === currentUser.avatarId
);

const topAdImage = data.placeholderImages.find(
    (img) => img.id === 'ad-banner-top'
);

const bottomAdImage = data.placeholderImages.find(
    (img) => img.id === 'ad-banner-bottom'
);


function AdBanner({ image, className }: { image?: { imageUrl: string, description: string, imageHint: string }, className?: string }) {
    return (
        <div className={cn("bg-muted text-muted-foreground text-center relative h-48", className)}>
            {image ? (
                <Image
                    src={image.imageUrl}
                    alt={image.description}
                    data-ai-hint={image.imageHint}
                    fill
                    className='object-cover'
                />
            ) : (
                 <div className="flex items-center justify-center h-full">
                    <p>منطقة الإعلان</p>
                </div>
            )}
        </div>
    )
}

function TopAdBanner() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="relative bg-background border-b">
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? '12rem' : '0rem' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <AdBanner image={topAdImage} className="border-b-0"/>
      </motion.div>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'absolute left-4 bg-black/50 hover:bg-black/75 text-white rounded-full h-8 w-8 z-10 transition-all',
           isExpanded ? 'bottom-2' : '-bottom-4'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        <span className="sr-only">{isExpanded ? 'إخفاء الإعلان' : 'إظهار الإعلان'}</span>
      </Button>
    </div>
  );
}

function AppLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // In a real app, this would be based on a proper auth session
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'patient' | 'doctor' | 'admin' | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [isRegisterAsDialogOpen, setIsRegisterAsDialogOpen] = useState(false);
  
  // For prototype, assume doctor '1' is logged in
  const loggedInDoctorId = '1';
  const unreadMessages = allMessages.filter(m => m.recipientId === loggedInDoctorId && !m.read);


  useEffect(() => {
    setIsClient(true);
    const authStatus = sessionStorage.getItem('isAuthenticated');
    const role = sessionStorage.getItem('userRole') as 'patient' | 'doctor' | 'admin' | null;

    if (authStatus === 'true' && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }

    // This is a prototype-specific hack to set role based on URL
    if (authStatus === 'true') {
        if (pathname.startsWith('/dashboard/doctor') || pathname.startsWith('/forum') || pathname.startsWith('/profile/doctor-settings')) {
            setUserRole('doctor');
            sessionStorage.setItem('userRole', 'doctor');
        } else if (pathname.startsWith('/dashboard/patient') || pathname.startsWith('/profile')) {
            setUserRole('patient');
            sessionStorage.setItem('userRole', 'patient');
        } else if (pathname.startsWith('/dashboard')) {
             setUserRole('admin');
            sessionStorage.setItem('userRole', 'admin');
        }
    }

  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith('/login')) {
      const params = new URLSearchParams(window.location.search);
      const role = params.get('role');
      if (role) {
        sessionStorage.setItem('loginRole', role);
      }
    }

    if (pathname === '/dashboard/patient' || pathname === '/dashboard/doctor' || pathname === '/dashboard') {
        const authSet = sessionStorage.getItem('isAuthenticated');
        if (!authSet) {
             sessionStorage.setItem('isAuthenticated', 'true');
             setIsAuthenticated(true);
        }
    }
  }, [pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('loginRole');
    setIsAuthenticated(false);
    setUserRole(null);
    if (typeof window !== 'undefined') {
        window.location.href = '/';
    }
  };

  const isHomePage = pathname === '/';
  const isLoginPage = pathname.startsWith('/login');
  const isRegisterPage = pathname.startsWith('/register');
  
  const loggedInUser = userRole === 'doctor' 
    ? (allDoctors.find(d => d.id === loggedInDoctorId) || { name: 'Doctor' }) 
    : currentUser;

  const header = (
     <header className="flex h-14 items-center justify-between border-b bg-background px-4 sm:px-8">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <div className={cn(isHomePage && !isAuthenticated ? '' : 'hidden md:block')}>
            <Logo />
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isClient && isAuthenticated ? (
            <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                    مرحباً بعودتك، {loggedInUser.name}!
                </span>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell />
                     {unreadMessages.length > 0 && userRole === 'doctor' && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                            {unreadMessages.length}
                        </span>
                     )}
                    <span className="sr-only">الإشعارات</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-96">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">الإشعارات</h4>
                       {userRole !== 'doctor' || unreadMessages.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            ليس لديك إشعارات جديدة.
                        </p>
                        ) : (
                        <p className="text-sm text-muted-foreground">
                           لديك {unreadMessages.length} رسائل جديدة.
                        </p>
                        )}
                    </div>
                    {userRole === 'doctor' && unreadMessages.length > 0 && (
                        <div className="grid gap-2">
                         {unreadMessages.map(msg => (
                            <div key={msg.id} className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                                <span className="flex h-2 w-2 translate-y-1.5 rounded-full bg-primary" />
                                <div className="grid gap-1">
                                <p className="text-sm font-medium">
                                    رسالة جديدة من {msg.senderName}
                                </p>
                                <p className="text-sm text-muted-foreground truncate">
                                    {msg.content}
                                </p>
                                 <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true, locale: ar })}
                                </p>
                                </div>
                            </div>
                         ))}
                        </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-9 w-9">
                      {userAvatar && (
                        <AvatarImage
                          src={userAvatar.imageUrl}
                          alt={userAvatar.description}
                          width={40}
                          height={40}
                          data-ai-hint={userAvatar.imageHint}
                        />
                      )}
                      <AvatarFallback>{loggedInUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {loggedInUser.name}
                      </p>
                       { 'email' in loggedInUser && <p className="text-xs leading-none text-muted-foreground">
                        {loggedInUser.email}
                      </p>}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href={userRole === 'doctor' ? "/profile/doctor-settings" : "/profile"} className="w-full">
                      ملفي الشخصي
                    </Link>
                  </DropdownMenuItem>
                   { userRole === 'patient' && <DropdownMenuItem>
                    <Link href="/dashboard/patient" className="w-full">
                      المواعيد
                    </Link>
                  </DropdownMenuItem> }
                   { userRole === 'doctor' && <DropdownMenuItem>
                    <Link href="/dashboard/doctor" className="w-full">
                      لوحة التحكم
                    </Link>
                  </DropdownMenuItem> }
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="ml-2 h-4 w-4" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
             isClient && <div className="flex items-center gap-2">
               <Button asChild variant="outline"><Link href="/login">تسجيل الدخول</Link></Button>
               <Button onClick={() => setIsRegisterAsDialogOpen(true)}>إنشاء حساب</Button>
             </div>
          )}
        </div>
      </header>
  );

  const mainContent = (
    <main className="flex flex-1 flex-col">
        {children}
    </main>
  );

  const adFooter = <AdBanner image={bottomAdImage} className="mt-auto" />;

  const appFooter = (
    <footer className="border-t bg-background p-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Medical Services. كل الحقوق محفوظة.
    </footer>
  );
  
  const patientMenu = [
    { id: 'home', href: '/', label: 'الرئيسية', icon: Home },
    { id: 'search', label: 'البحث عن طبيب', icon: Search, action: () => setIsSearchDialogOpen(true) },
    { id: 'appointments', href: '/dashboard/patient', label: 'مواعيــدي', icon: LayoutGrid },
    { id: 'profile', href: '/profile', label: 'ملفي الشخصي', icon: UserIcon },
  ];
  
  const doctorMenu = [
    { id: 'dashboard', href: '/dashboard/doctor', label: 'لوحة التحكم', icon: LayoutGrid },
    { id: 'forum', href: '/forum', label: 'المنتدى', icon: MessageSquare },
    { id: 'settings', href: '/profile/doctor-settings', label: 'ملفي الشخصي', icon: Settings },
    { id: 'search', label: 'البحث عن طبيب', icon: Search, action: () => setIsSearchDialogOpen(true) },
  ];

  const unauthenticatedMenu = [
    { id: 'home', href: '/', label: 'الرئيسية', icon: Home },
    { id: 'search', label: 'البحث عن طبيب', icon: Search, action: () => setIsSearchDialogOpen(true) },
    { id: 'login', href: '/login', label: 'تسجيل الدخول', icon: LogIn },
    { id: 'register', label: 'إنشاء حساب', icon: UserPlus, action: () => setIsRegisterAsDialogOpen(true) },
  ];

  const getMenuItems = () => {
    if (isAuthenticated) {
        switch(userRole) {
            case 'doctor': return doctorMenu;
            case 'patient': return patientMenu;
            default: return patientMenu; // Default authenticated view
        }
    }
    return unauthenticatedMenu;
  }

  const currentMenuItems = getMenuItems();
  const sidebarCollapsible = (isHomePage && !isAuthenticated) ? 'none' : (isHomePage ? 'none' : 'icon');
  
  const homePageUnauthenticated = (
    <div className="flex min-h-screen w-full flex-col">
      {header}
      <TopAdBanner />
      {mainContent}
      {adFooter}
      {appFooter}
    </div>
  );

  if (isLoginPage || isRegisterPage) {
      return (
        <>
            {children}
            <RegisterAsDialog
                isOpen={isRegisterAsDialogOpen}
                setIsOpen={setIsRegisterAsDialogOpen}
            />
        </>
      )
  }

  if (isClient && isHomePage && !isAuthenticated) {
     return (
        <>
            {homePageUnauthenticated}
            <SearchDialog 
                isOpen={isSearchDialogOpen} 
                setIsOpen={setIsSearchDialogOpen}
                doctors={doctors}
            />
            <RegisterAsDialog
                isOpen={isRegisterAsDialogOpen}
                setIsOpen={setIsRegisterAsDialogOpen}
            />
        </>
    );
  }
  
  if (!isClient) {
    return null;
  }

  return (
      <>
        <SearchDialog 
            isOpen={isSearchDialogOpen} 
            setIsOpen={setIsSearchDialogOpen}
            doctors={doctors}
        />
        <RegisterAsDialog
            isOpen={isRegisterAsDialogOpen}
            setIsOpen={setIsRegisterAsDialogOpen}
        />
        <Sidebar side="right" collapsible={sidebarCollapsible}>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {currentMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild={!!item.href}
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    onClick={item.action}
                  >
                    {item.href ? (
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <>
                        <item.icon />
                        <span>{item.label}</span>
                      </>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            {/* Footer content if any */}
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
         {header}
         <TopAdBanner />
          {mainContent}
          {adFooter}
          {appFooter}
        </SidebarInset>
      </>
  );
}


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  )
}
