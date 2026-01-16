import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  maxWidth?: string;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  description,
  children, 
  footer, 
  className,
  maxWidth = "sm:max-w-[500px]"
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={cn(maxWidth, "glass tech-border animate-in fade-in zoom-in-95 duration-300 ease-out data-[state=open]:slide-in-from-right-1/2 ", className)}
      >
        <DialogHeader className={cn("border-b border-border/40 pb-4 p-6", !title && !description && "sr-only")}>
          <DialogTitle className={cn("text-xl font-black uppercase tracking-tighter", !title && "sr-only")}>
            {title || 'Dialog'}
          </DialogTitle>
          {description ? (
            <DialogDescription>
              {description}
            </DialogDescription>
          ) : (
            <DialogDescription className="sr-only">
              Modal content for {typeof title === 'string' ? title : 'this dialog'}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="py-2 p-6">
            {children}
        </div>
        {footer && (
          <div className="flex justify-end space-x-2 pt-4 border-t border-border/40 mt-2 p-6">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
