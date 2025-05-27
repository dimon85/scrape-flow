'use client'
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CoinsIcon, HomeIcon, Layers2Icon, MenuIcon, ShieldCheckIcon } from 'lucide-react';
import { Button, buttonVariants } from './ui/button';
import Logo from '@/components/Logo';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet';
import UserAvailableCreditsBadge from '@/components/UserAvailableCreditsBadge';

const routes = [
  {
    href: '',
    label: 'Home',
    icon: HomeIcon,
  },
  {
    href: 'workflows',
    label: 'Workflows',
    icon: Layers2Icon,
  },
  {
    href: 'credentials',
    label: 'Credentials',
    icon: ShieldCheckIcon,
  },
  {
    href: 'billing',
    label: 'Billing',
    icon: CoinsIcon,
  },
];

export const DesktopSidebar = () => {
  const pathname = usePathname();
  const activeRoute = routes.find((route) => route.href.length > 0 && pathname.includes(route.href)) || routes[0];

  return (
    <div className="hidden relative md:block min-w-[280px] max-w-[280px] h-screend overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate">
      <div className="flex items-center justify-center gap-2 border-b-[1px] bordre-separate p-4">
        <Logo />
      </div>
      <div className="flex p-2"><UserAvailableCreditsBadge /></div>
      <div className="flex flex-col">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={`/${route.href}`}
            className={
              buttonVariants({
                variant: activeRoute.href === route.href ? 'sidebarActiveItem' : 'sidebarItem',
              })
            }
          >
            {route.icon && <route.icon size="20" />}
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export const MobileSidebar = () => {
  const pathname = usePathname();
  const activeRoute = routes.find((route) => route.href.length > 0 && pathname.includes(route.href)) || routes[0];

  const [isOpen, setOpen] = useState(false);

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet
          open={isOpen}
          onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="2-[400px] sm:w-[540px] space-y-4"
              side={"left"}
            >
              <SheetTitle>
                <Logo />
              </SheetTitle>
              <UserAvailableCreditsBadge />
              <div className="flex flex-col gap-1">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={`/${route.href}`}
                    className={
                      buttonVariants({
                        variant: activeRoute.href === route.href ? 'sidebarActiveItem' : 'sidebarItem',
                      })
                    }
                    onClick={() => setOpen(false)}
                  >
                    {route.icon && <route.icon size="20" />}
                    {route.label}
                  </Link>
                ))}
              </div>
              <SheetDescription></SheetDescription>
            </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};
