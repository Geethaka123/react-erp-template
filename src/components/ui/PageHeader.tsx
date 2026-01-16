import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-start justify-between gap-6", className)}>
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-foreground flex items-center gap-3">
          {title}
        </h1>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
      {children && (
        <div className="flex gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
