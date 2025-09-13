'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Home,
  LayoutGrid,
  LogIn,
  Search,
  UserPlus,
  User as UserIcon,
} from 'lucide-react';

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
import { currentUser } from '@/lib/data';
import Logo from '@/components/logo';
import data from '@/lib/placeholder-images.json';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const userAvatar = data.placeholderImages.find(
  (img) => img.id === currentUser.avatarId
);

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // In a real app, this would be based on a proper auth session
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  const isHomePage = pathname === '/';
  const hideSidebar = isHomePage && !isAuthenticated;

  const header = (
     <header className="flex h-14 items-center justify-between border-b bg-background px-4 sm:px-8">
        <div className="flex items-center gap-4">
          {!hideSidebar && <SidebarTrigger className="md:hidden" />}
          <div className={cn(hideSidebar ? '' : 'hidden md:block')}>
            <Logo />
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Bell />
                    <span className="sr-only">الإشعارات</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">الإشعارات</h4>
                      <p className="text-sm text-muted-foreground">
                        لديك رسالتان جديدتان.
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1.5 rounded-full bg-primary" />
                        <div className="grid gap-1">
                          <p className="text-sm font-medium">
                            تذكير بالموعد
                          </p>
                          <p className="text-sm text-muted-foreground">
                            موعدك مع د. ريد غدًا.
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1.5 rounded-full bg-primary" />
                        <div className="grid gap-1">
                          <p className="text-sm font-medium">
                            رسالة جديدة
                          </p>
                          <p className="text-sm text-muted-foreground">
                            أرسل لك د. شارما رسالة.
                          </p>
                        </div>
                      </div>
                    </div>
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
                      <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile" className="w-full">
                      ملفي الشخصي
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/dashboard" className="w-full">
                      المواعيد
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsAuthenticated(false)}>تسجيل الخروج</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
             <div className="flex items-center gap-2">
               <Button variant="outline" onClick={() => setIsAuthenticated(true)}>تسجيل الدخول</Button>
               <Button>إنشاء حساب</Button>
             </div>
          )}
        </div>
      </header>
  );

  if (hideSidebar) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        {header}
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    );
  }

  const authenticatedMenu = [
    { href: '/', label: 'البحث عن طبيب', icon: Search },
    { href: '/dashboard', label: 'مواعيــدي', icon: LayoutGrid },
    { href: '/profile', label: 'ملفي الشخصي', icon: UserIcon },
  ];

  const unauthenticatedMenu = [
    { href: '/', label: 'البحث عن طبيب', icon: Search },
    { href: '#', label: 'تسجيل الدخول', icon: LogIn, action: () => setIsAuthenticated(true) },
    { href: '#', label: 'إنشاء حساب', icon: UserPlus, action: () => {} },
  ]

  const currentMenuItems = isAuthenticated ? authenticatedMenu : unauthenticatedMenu;


  return (
    <SidebarProvider>
      <Sidebar side="right">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {currentMenuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild={!!item.href && item.href !== '#'}
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  onClick={item.action}
                >
                  {item.href && item.href !== '#' ? (
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
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
