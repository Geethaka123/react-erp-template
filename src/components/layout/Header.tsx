import { Menu, Bell, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/context/AuthContext";

import { ThemeToggle } from "../ui/ThemeToggle";

interface HeaderProps {
  toggle: () => void;
}

export function Header({ toggle }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 glass relative z-50">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-4 flex-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggle}
          className="md:hidden text-muted-foreground hover:text-primary transition-colors"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* <div className="relative w-full max-w-md hidden sm:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search tasks, invoices..." 
            className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-full h-9 text-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 px-1.5 py-0.5 rounded border border-border/50 bg-muted/30 text-[10px] text-muted-foreground font-mono">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div> */}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-1 pr-2 border-r border-border/50 mr-1 md:mr-2">
          <ThemeToggle />
          
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background animate-pulse" />
          </Button>
          
          <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground hover:text-primary transition-colors">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative flex items-center gap-3 px-2 py-1.5 hover:bg-primary/5 transition-all rounded-full border-0">
              <div className="hidden md:flex flex-col items-end text-right">
                <span className="text-xs font-bold text-foreground leading-none">{user?.name || 'Guest User'}</span>
                <span className="text-[10px] text-muted-foreground font-medium">{user?.role || 'Guest'}</span>
              </div>
              <Avatar className="h-8 w-8 border border-border/50 shadow-sm ring-2 ring-primary/10">
                <AvatarImage src={`https://avatar.iran.liara.run/username?username=${user?.name || 'Guest'}`} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 glass border-border/50 animate-in slide-in-from-top-2 duration-200">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem className="cursor-pointer focus:bg-primary/10 transition-colors">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer focus:bg-primary/10 transition-colors">
              <Settings className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem 
              onClick={logout}
              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors font-semibold"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
