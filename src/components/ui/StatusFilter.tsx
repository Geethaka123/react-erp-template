import { cn } from "@/lib/utils";

interface StatusFilterProps {
  options: string[];
  currentValue: string;
  onChange: (value: string) => void;
  className?: string;
}

export function StatusFilter({ options, currentValue, onChange, className }: StatusFilterProps) {
  return (
    <div className={cn("flex bg-background border border-border rounded-lg p-1 shadow-sm", className)}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "px-4 py-1.5 text-xs font-bold rounded-md transition-all",
            currentValue === opt 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
