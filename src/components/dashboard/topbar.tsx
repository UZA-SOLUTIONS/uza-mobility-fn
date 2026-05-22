'use client';

import { ThemeToggle } from '@/components/shared/theme-toggle';
import { useAppStore } from '@/stores/app-store';
import { Button } from '@/components/ui/button';

export function DashboardTopbar() {
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden"
        onClick={toggleSidebar}
      >
        Menu
      </Button>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
