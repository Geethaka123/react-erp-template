import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewControlsProps {
  viewMode: 'table' | 'grid';
  onViewToggle: () => void;
  className?: string;
}

export function ViewControls({ viewMode, onViewToggle, className }: ViewControlsProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={onViewToggle}
        className={cn(
          "h-9 w-9 border-border transition-all",
          viewMode === 'grid' ? "bg-slate-800 text-white border-slate-700 shadow-inner" : "bg-background text-foreground hover:bg-muted"
        )}
      >
        {viewMode === 'table' ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
      </Button>
    </div>
  );
}
