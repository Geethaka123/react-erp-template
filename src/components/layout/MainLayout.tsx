import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

export function MainLayout() {
  const [opened, setOpened] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMobile = () => setOpened((o) => !o);
  const toggleCollapse = () => setIsCollapsed((c) => !c);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden transition-colors">
      {/* Mobile Sidebar */}
      {opened && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden" onClick={toggleMobile}>
          <div className="w-68 h-full bg-[#111827]" onClick={(e) => e.stopPropagation()}>
            <Sidebar isCollapsed={false} onToggle={toggleMobile} showCloseIcon={true} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden md:flex flex-col shrink-0 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <Sidebar isCollapsed={isCollapsed} onToggle={toggleCollapse} />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <div className="sticky top-0 z-40">
          <Header toggle={toggleMobile} />
        </div>
        
        <main className="flex-1 overflow-auto px-4 py-4 md:px-6 md:py-8">
          <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
