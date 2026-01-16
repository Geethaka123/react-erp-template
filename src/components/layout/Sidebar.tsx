import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Hexagon,
  LogOut,
  Briefcase,
  Menu,
  Moon,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/context/AuthContext';

const menuItems = [
  { link: '/', label: 'Home', icon: LayoutDashboard },
  { link: '/invoices', label: 'Invoices', icon: Briefcase },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  showCloseIcon?: boolean;
}

export function Sidebar({ isCollapsed, onToggle, showCloseIcon }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className={cn(
      "flex flex-col h-full transition-all duration-300 overflow-hidden",
      isCollapsed 
        ? "bg-background dark:bg-card border-r border-border text-foreground/60" 
        : "bg-background dark:bg-card border-r border-border text-foreground/80"
    )}>
      {/* Top Toggle Button */}
      <div className={cn(
        "p-4 flex items-center transition-all duration-300",
        isCollapsed ? "flex-col gap-4 border-b border-border/50 mb-2" : "justify-between"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center relative overflow-hidden shrink-0 shadow-sm border border-primary/10">
            <Hexagon className="h-5 w-5 text-primary fill-primary/20 transition-all duration-500 ease-in-out dark:scale-0 dark:opacity-0" />
            <Moon className="h-5 w-5 text-primary fill-primary/20 absolute transition-all duration-500 ease-in-out scale-0 opacity-0 dark:scale-100 dark:opacity-100 rotate-90 dark:rotate-0" />
          </div>
          {!isCollapsed && (
            <span className="font-black text-foreground text-lg tracking-tight animate-in fade-in slide-in-from-left-2 duration-500">
              CoreSync
            </span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle}
          className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors group/toggle relative"
        >
          <Menu className={cn(
            "h-6 w-6 transition-all duration-500 ease-in-out",
            isCollapsed ? "rotate-90" : "rotate-0",
            showCloseIcon ? "opacity-0 scale-0 rotate-90" : "opacity-100 scale-100"
          )} />
          <X className={cn(
            "h-6 w-6 transition-all duration-500 ease-in-out absolute",
            showCloseIcon ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-0 -rotate-90"
          )} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 px-2 space-y-2",
        isCollapsed ? "items-center" : ""
      )}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.link || (item.link !== '/' && location.pathname.startsWith(item.link));
          
          return (
            <div key={item.label} className="w-full">
              <Button
                variant="ghost"
                className={cn(
                  "w-full transition-all group overflow-hidden",
                  isCollapsed 
                    ? "flex-col h-auto py-3 px-1 gap-1" 
                    : "justify-start py-4 px-4",
                  isActive 
                    ? "bg-primary/10 dark:bg-primary text-primary dark:text-white shadow-xs dark:shadow-md dark:shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                asChild
              >
                <RouterLink to={item.link} className={cn(isCollapsed ? "flex flex-col items-center" : "")}>
                  <item.icon className={cn(
                    isCollapsed ? "h-6 w-6 mb-1 rotate-[360deg]" : "mr-3 h-5 w-5 rotate-0",
                    "transition-transform duration-500 ease-in-out",
                    isActive 
                      ? "text-primary dark:text-white" 
                      : "text-muted-foreground group-hover:text-primary transition-colors"
                  )} />
                  <span className={cn(
                    "font-bold transition-all",
                    isCollapsed ? "text-[8px] uppercase tracking-tighter" : "text-sm"
                  )}>
                    {item.label}
                  </span>
                </RouterLink>
              </Button>
            </div>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className={cn(
        "p-2 border-t border-border/50",
        isCollapsed ? "mt-auto" : ""
      )}>
        <Button
          variant="ghost"
          className={cn(
            "w-full transition-all",
            isCollapsed 
              ? "flex-col h-auto py-3 px-1 gap-1" 
              : "justify-start py-4 px-4 text-muted-foreground hover:text-primary hover:bg-primary/10",
            isCollapsed ? "text-primary font-bold" : ""
          )}
          onClick={logout}
        >
          <div className={cn(isCollapsed ? "flex flex-col items-center" : "flex items-center")}>
            <LogOut className={cn(
              isCollapsed ? "h-6 w-6 mb-1 rotate-180" : "mr-3 h-4 w-4 rotate-0",
              "transition-transform duration-500 ease-in-out"
            )} />
            <span className={cn(
              "font-bold",
              isCollapsed ? "text-[8px] uppercase tracking-tighter" : "text-sm"
            )}>
              Log Out
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
}

